import analyzeTransactions from "./services/detection/analyzetransactions.js";
import transactions from "../../data/output/transactions.json" with { type: "json" };

console.log("Starting API test...");

const result = analyzeTransactions(transactions);

console.log("API result:");
console.dir(result, { depth: null });