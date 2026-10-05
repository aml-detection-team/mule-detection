import { createHash } from "node:crypto";

import Flag from "../models/Flag.js";
import Transaction from "../models/Transaction.js";

import analyzeTransactions from "../services/detection/analyzetransactions.js";
import adaptDetectionResults from "../services/detection/detectionAdapter.js";

import transactions from "../../../data/output/transactions.json" with { type: "json" };

const EMPTY_RISK = {
  score: 0,
  riskLevel: "LOW",
  reasons: [],
};

const RISK_LEVELS = new Set(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);

function uniqueStrings(values) {
  if (!Array.isArray(values)) {
    return [];
  }

  return [
    ...new Set(values.filter((value) => typeof value === "string" && value)),
  ];
}

function normalizeRisk(risk = {}) {
  const score = Number(risk.score);
  const riskLevel = risk.riskLevel ?? risk.level;

  return {
    score: Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : 0,
    riskLevel: RISK_LEVELS.has(riskLevel) ? riskLevel : "LOW",
    reasons: Array.isArray(risk.reasons) ? risk.reasons : [],
  };
}

function getDetectionPattern(detection) {
  if (typeof detection.pattern === "string") {
    return detection.pattern;
  }

  if (typeof detection.pattern?.type === "string") {
    return detection.pattern.type;
  }

  return typeof detection.type === "string" ? detection.type : "unknown";
}

function deriveOverallRisk(detections) {
  let overallRisk = EMPTY_RISK;

  for (const detection of detections) {
    if (!detection || typeof detection !== "object") {
      continue;
    }

    const risk = detection.riskResult ?? detection.risk;

    if (risk) {
      const normalizedRisk = normalizeRisk(risk);

      if (normalizedRisk.score > overallRisk.score) {
        overallRisk = normalizedRisk;
      }
    }
  }

  return overallRisk;
}

function deriveAccountRisks(detections, overallRisk) {
  const risksByAccount = new Map();

  for (const detection of detections) {
    const detectionRisk = normalizeRisk(
      detection.riskResult ?? detection.risk ?? overallRisk,
    );

    for (const accountId of detection.accountIds) {
      const currentRisk = risksByAccount.get(accountId);

      if (!currentRisk || detectionRisk.score > currentRisk.riskScore) {
        risksByAccount.set(accountId, {
          accountId,
          riskScore: detectionRisk.score,
          riskLevel: detectionRisk.riskLevel,
          reasons: detectionRisk.reasons,
        });
      }
    }
  }

  return [...risksByAccount.values()];
}

function normalizeDetectionResult(result = {}) {
  const rawDetections = Array.isArray(result.detections)
    ? result.detections
    : Array.isArray(result.circularFlow)
      ? result.circularFlow.map((flow) => ({
          ...flow,
          pattern: "circular_flow",
        }))
      : result.circularFlow
        ? [
            {
              ...result.circularFlow,
              pattern: "circular_flow",
            },
          ]
        : [];

  const detections = rawDetections
    .filter((detection) => detection && typeof detection === "object")
    .map((detection) => ({
      ...detection,
      pattern: getDetectionPattern(detection),
      accountIds: uniqueStrings(detection.accountIds),
      transactionIds: uniqueStrings(detection.transactionIds),
      transactions: Array.isArray(detection.transactions)
        ? detection.transactions
        : [],
    }));

  const riskResult = result.riskResult
    ? normalizeRisk(result.riskResult)
    : deriveOverallRisk(rawDetections);

  const suppliedAccountRisks = Array.isArray(result.accountRisks)
    ? result.accountRisks
    : [];

  const accountRisks =
    suppliedAccountRisks.length > 0
      ? suppliedAccountRisks
      : deriveAccountRisks(detections, riskResult);

  return {
    ...result,
    detections,
    riskResult,
    accountRisks,
  };
}

function makeKey(parts) {
  return createHash("sha256").update(JSON.stringify(parts)).digest("hex");
}

function buildFlags(detectionResult) {
  const accountRiskById = new Map(
    detectionResult.accountRisks.map((risk) => [risk.accountId, risk]),
  );

  const flagsByKey = new Map();

  for (const detection of detectionResult.detections) {
    const transactionIds = uniqueStrings(detection.transactionIds);

    const accountIds = uniqueStrings(detection.accountIds);

    if (
      detection.pattern === "unknown" ||
      transactionIds.length === 0 ||
      accountIds.length === 0
    ) {
      continue;
    }

    const scenarioKey = makeKey([
      detection.pattern,
      [...transactionIds].sort(),
    ]);

    for (const accountId of accountIds) {
      const accountRisk = accountRiskById.get(accountId);

      const fallbackRisk = accountRisk
        ? {
            score: accountRisk.riskScore ?? accountRisk.score,
            riskLevel: accountRisk.riskLevel,
            reasons: accountRisk.reasons,
          }
        : detectionResult.riskResult;

      const risk = normalizeRisk(
        detection.riskResult ?? detection.risk ?? fallbackRisk,
      );

      const flagKey = makeKey([scenarioKey, accountId]);

      flagsByKey.set(flagKey, {
        flagKey,
        scenarioKey,
        accountId,
        pattern: detection.pattern,
        riskLevel: risk.riskLevel,
        riskScore: risk.score,
        transactionIds,
        reasons: risk.reasons,
      });
    }
  }

  return [...flagsByKey.values()];
}

async function getTransactionsForDetection(req, res) {
  // Keep the older raw-array request format.
  if (Array.isArray(req.body)) {
    return req.body;
  }

  // Allow callers to request specific transactions.
  if (req.body?.transactionIds !== undefined) {
    const { transactionIds } = req.body;

    if (
      !Array.isArray(transactionIds) ||
      transactionIds.some((transactionId) => typeof transactionId !== "string")
    ) {
      res.status(400).json({
        message: "transactionIds must be an array of strings",
      });

      return null;
    }

    const requestedIds = uniqueStrings(transactionIds);

    const matchingTransactions = await Transaction.find({
      transactionId: {
        $in: requestedIds,
      },
    }).lean();

    const byId = new Map(
      matchingTransactions.map((transaction) => [
        transaction.transactionId,
        transaction,
      ]),
    );

    const missingIds = requestedIds.filter((id) => !byId.has(id));

    if (missingIds.length > 0) {
      res.status(400).json({
        message: "Some transaction IDs were not found",
        missingTransactionIds: missingIds,
      });

      return null;
    }

    return requestedIds.map((id) => byId.get(id));
  }

  // Normal Week 3 behavior: load everything
  // from MongoDB.
  return Transaction.find().lean();
}

async function detectTransactions(req, res) {
  const transactionsForDetection = await getTransactionsForDetection(req, res);

  if (!transactionsForDetection) {
    return;
  }

  if (!Array.isArray(transactionsForDetection)) {
    return res.status(400).json({
      message: "Transactions must be an array",
    });
  }

  // groundTruth.json is never used by the detector.
  const rawResult = analyzeTransactions(transactionsForDetection);

  const detectionResult = normalizeDetectionResult(rawResult);

  const flagDocuments = buildFlags(detectionResult);

  if (flagDocuments.length > 0) {
    await Flag.bulkWrite(
      flagDocuments.map((flag) => ({
        updateOne: {
          filter: {
            flagKey: flag.flagKey,
          },

          update: {
            $set: {
              scenarioKey: flag.scenarioKey,
              accountId: flag.accountId,
              pattern: flag.pattern,
              riskLevel: flag.riskLevel,
              riskScore: flag.riskScore,
              transactionIds: flag.transactionIds,
              reasons: flag.reasons,
            },

            $setOnInsert: {
              flagKey: flag.flagKey,
            },
          },

          upsert: true,
        },
      })),
      { ordered: true },
    );
  }

  const savedFlags =
    flagDocuments.length > 0
      ? await Flag.find({
          flagKey: {
            $in: flagDocuments.map((flag) => flag.flagKey),
          },
        }).lean()
      : [];

  return res.json({
    ...detectionResult,
    flags: savedFlags,
    flagCount: savedFlags.length,
  });
}

// Existing B detection endpoint.
// Uses the committed demo dataset and B's adapter.
function getDetectionResults(req, res) {
  try {
    console.log("Running transaction analysis...");

    const result = analyzeTransactions(transactions);

    const adaptedResult = adaptDetectionResults(result, transactions);

    return res.status(200).json(adaptedResult);
  } catch (error) {
    console.error("Detection error:", error);

    return res.status(500).json({
      message: "Failed to analyze transactions",
      error: error.message,
    });
  }
}

export default detectTransactions;

export { buildFlags, normalizeDetectionResult, getDetectionResults };
