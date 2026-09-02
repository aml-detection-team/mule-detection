const fs=require("fs")
const groundTruth = require("../output/groundTruth.json");
const normalTransactions = require("../output/normalTransactions.json");
const cycleTransactions = require("../output/cycleTransactions.json");

const allTransactions = [
    ...normalTransactions,
    ...cycleTransactions
];
fs.writeFileSync(
    "data/output/transactions.json",
    JSON.stringify(allTransactions, null, 2)
);
console.log(groundTruth);
//console.log(allTransactions)