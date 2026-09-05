import fs from "fs";

import analyzeTransactions from "./services/detection/analyzeTransactions.js";

const transactions = JSON.parse(
    fs.readFileSync("data/output/transactions.json", "utf-8")
);

const analysis = analyzeTransactions(transactions);

console.log("Final transaction analysis:");
console.log(analysis);