import {
  buildFlags,
  normalizeDetectionResult,
} from "../src/controllers/detectionController.js";
import { loadGeneratedData } from "../scripts/seedDemoData.js";

test("adapts Person B's current circular-flow result without changing its fields", () => {
  const legacyResult = {
    circularFlow: {
      accountIds: ["ACC_A", "ACC_B"],
      transactionIds: ["TX_1", "TX_2"],
      transactions: [
        { transactionId: "TX_1", fromAccount: "ACC_A", toAccount: "ACC_B" },
        { transactionId: "TX_2", fromAccount: "ACC_B", toAccount: "ACC_A" },
      ],
    },
    riskResult: {
      score: 85,
      riskLevel: "CRITICAL",
      reasons: ["Circular flow detected"],
    },
    accountRisks: [
      {
        accountId: "ACC_A",
        riskScore: 85,
        riskLevel: "CRITICAL",
        reasons: ["Circular flow detected"],
      },
      {
        accountId: "ACC_B",
        riskScore: 85,
        riskLevel: "CRITICAL",
        reasons: ["Circular flow detected"],
      },
    ],
  };

  const result = normalizeDetectionResult(legacyResult);
  const flags = buildFlags(result);

  expect(result.circularFlow).toEqual(legacyResult.circularFlow);
  expect(result.detections).toHaveLength(1);
  expect(result.detections[0]).toMatchObject({
    pattern: "circular_flow",
    accountIds: ["ACC_A", "ACC_B"],
    transactionIds: ["TX_1", "TX_2"],
  });
  expect(flags).toHaveLength(2);
  expect(flags[0]).toMatchObject({
    pattern: "circular_flow",
    riskLevel: "CRITICAL",
    riskScore: 85,
  });
  expect(buildFlags(result).map((flag) => flag.flagKey)).toEqual(
    flags.map((flag) => flag.flagKey),
  );
});

test("normalizes multiple generalized detections and keeps their scenario risks", () => {
  const result = normalizeDetectionResult({
    detections: [
      {
        pattern: "fan_in",
        accountIds: ["ACC_A", "ACC_B"],
        transactionIds: ["TX_1", "TX_2"],
        risk: {
          score: 85,
          level: "CRITICAL",
          reasons: ["Many incoming transfers"],
        },
      },
      {
        pattern: { type: "fan_out" },
        accountIds: ["ACC_A"],
        transactionIds: ["TX_3"],
        riskResult: {
          score: 70,
          riskLevel: "HIGH",
          reasons: ["Many outgoing transfers"],
        },
      },
    ],
  });

  const flags = buildFlags(result);
  const fanOutFlag = flags.find((flag) => flag.pattern === "fan_out");

  expect(result.detections.map((detection) => detection.pattern)).toEqual([
    "fan_in",
    "fan_out",
  ]);
  expect(result.riskResult).toMatchObject({
    score: 85,
    riskLevel: "CRITICAL",
  });
  expect(result.accountRisks).toHaveLength(2);
  expect(flags).toHaveLength(3);
  expect(fanOutFlag).toMatchObject({ riskScore: 70, riskLevel: "HIGH" });
});

test("seed loader reads accounts and transactions only", async () => {
  const data = await loadGeneratedData();

  expect(Object.keys(data).sort()).toEqual(["accounts", "transactions"]);
  expect(data.accounts).toHaveLength(100);
  expect(data.transactions.length).toBeGreaterThan(1000);
});
