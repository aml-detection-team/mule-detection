const fs = require("fs");

const cycleAccounts = [
    "ACC001",
    "ACC002",
    "ACC003",
    "ACC004"
];
const cycleTransactions = [];

for (let i = 0; i < cycleAccounts.length; i++){
  const fromAccount = cycleAccounts[i];
  const toAccount = cycleAccounts[(i + 1) % cycleAccounts.length];
  const transaction = {
    transactionId: "TX" + (31 + i).toString().padStart(3, "0"),
    fromAccount,
    toAccount,
    amount: 25000,
    currency: "INR",
    timestamp: new Date().toISOString()
  };
  cycleTransactions.push(transaction);

}
const groundTruth = {
    scenarioId: "CYCLE_001",
    pattern: "circular_flow",
    accountIds: cycleAccounts,
    transactionIds: cycleTransactions.map(transaction => transaction.transactionId)
};
fs.writeFileSync(
    "data/output/cycleTransactions.json",
    JSON.stringify(cycleTransactions, null, 2)
);
fs.writeFileSync(
    "data/output/groundTruth.json",
    JSON.stringify([groundTruth], null, 2)
);
//console.log(groundTruth)
//console.log(cycleTransactions);
