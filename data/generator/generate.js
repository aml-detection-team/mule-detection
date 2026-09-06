const fs = require("fs");

const generateNormalTransactions = require("./generateNormalTransactions.js");

const generateCycle = require("./generateCycle.js");

const generateFanIn = require("./generateFanIn.js");

const generateFanOut = require("./generateFanOut.js");

const generateStructuring = require("./generateStructuring.js");

const generateRapidPassThrough = require("./generateRapidPassThrough.js");

// --------------------------------------------------
// Decide how many suspicious scenarios to generate
// --------------------------------------------------

const totalScenarios = Math.floor(Math.random() * 6) + 5;

console.log("Total suspicious scenarios:", totalScenarios);

// --------------------------------------------------
// Randomly distribute scenarios across patterns
// --------------------------------------------------

const patternCounts = {
  cycle: 0,
  fanIn: 0,
  fanOut: 0,
  structuring: 0,
  rapidPassThrough: 0,
};

for (let i = 0; i < totalScenarios; i++) {
  const patterns = Object.keys(patternCounts);

  const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];

  patternCounts[randomPattern]++;
}

console.log(patternCounts);

// --------------------------------------------------
// Generate normal transactions
// --------------------------------------------------

const generatedNormalTransactions = generateNormalTransactions();

// --------------------------------------------------
// Generate circular-flow scenarios
// --------------------------------------------------

const generatedCycles = [];

for (let i = 0; i < patternCounts.cycle; i++) {
  const cycle = generateCycle(i + 1);
  generatedCycles.push(cycle);
}

// --------------------------------------------------
// Generate fan-in scenarios
// --------------------------------------------------

const generatedFanIns = [];

for (let i = 0; i < patternCounts.fanIn; i++) {
  const fanIn = generateFanIn(i + 1);
  generatedFanIns.push(fanIn);
}

// --------------------------------------------------
// Generate fan-out scenarios
// --------------------------------------------------

const generatedFanOuts = [];

for (let i = 0; i < patternCounts.fanOut; i++) {
  const fanOut = generateFanOut(i + 1);
  generatedFanOuts.push(fanOut);
}

// --------------------------------------------------
// Generate structuring scenarios
// --------------------------------------------------

const generatedStructurings = [];

for (let i = 0; i < patternCounts.structuring; i++) {
  const structuring = generateStructuring(i + 1);
  generatedStructurings.push(structuring);
}

// --------------------------------------------------
// Generate rapid pass-through scenarios
// --------------------------------------------------

const generatedRapidPassThroughs = [];

for (let i = 0; i < patternCounts.rapidPassThrough; i++) {
  const rapidPassThrough = generateRapidPassThrough(i + 1);

  generatedRapidPassThroughs.push(rapidPassThrough);
}

const generatedSuspiciousScenarios = [
  ...generatedCycles,
  ...generatedFanIns,
  ...generatedFanOuts,
  ...generatedStructurings,
  ...generatedRapidPassThroughs,
];

// --------------------------------------------------
// Extract suspicious transactions
// --------------------------------------------------

const suspiciousTransactions = generatedSuspiciousScenarios.flatMap(
  (scenario) => scenario.transactions,
);

// --------------------------------------------------
// Combine normal + suspicious transactions
// --------------------------------------------------

const allTransactions = [
  ...generatedNormalTransactions,
  ...suspiciousTransactions,
];

// --------------------------------------------------
// Shuffle all transactions
// --------------------------------------------------

allTransactions.sort(() => Math.random() - 0.5);

// --------------------------------------------------
// Assign final global transaction IDs
// --------------------------------------------------

allTransactions.forEach((transaction, index) => {
  const oldTransactionId = transaction.transactionId;

  transaction.transactionId = "TX" + String(index + 1).padStart(4, "0");

  // Temporary bridge used to update ground truth
  transaction.originalTransactionId = oldTransactionId;
});

// --------------------------------------------------
// Create temporary ID -> final ID lookup
// --------------------------------------------------

const transactionIdMap = {};

allTransactions.forEach((transaction) => {
  transactionIdMap[transaction.originalTransactionId] =
    transaction.transactionId;
});

// --------------------------------------------------
// Combine ground truth
// --------------------------------------------------

const allGroundTruth = generatedSuspiciousScenarios.map(
  (scenario) => scenario.groundTruth,
);

// --------------------------------------------------
// Update ground-truth transaction IDs
// --------------------------------------------------

const updatedGroundTruth = allGroundTruth.map((scenario) => {
  return {
    ...scenario,

    transactionIds: scenario.transactionIds.map(
      (oldId) => transactionIdMap[oldId],
    ),
  };
});

// --------------------------------------------------
// Remove temporary mapping field
// --------------------------------------------------

allTransactions.forEach((transaction) => {
  delete transaction.originalTransactionId;
});

// --------------------------------------------------
// Save final transactions
// --------------------------------------------------

fs.writeFileSync(
  "data/output/transactions.json",
  JSON.stringify(allTransactions, null, 2),
);

// --------------------------------------------------
// Save final ground truth
// --------------------------------------------------

fs.writeFileSync(
  "data/output/groundTruth.json",
  JSON.stringify(updatedGroundTruth, null, 2),
);
