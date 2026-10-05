import fs from "fs";
import detectCircularFlows from "./services/detection/circularFlow.js";

const transactions = JSON.parse(
    fs.readFileSync("data/output/transactions.json", "utf-8")
);

const ids = [
    "TX0885",
    "TX0684",
    "TX1009",
    "TX0785",
    "TX0865"
];

const cycleTransactions = transactions.filter(
    transaction => ids.includes(transaction.transactionId)
);

console.log("Transactions selected:", cycleTransactions.length);

const graph = {};

for (const transaction of cycleTransactions) {
    if (!graph[transaction.fromAccount]) {
        graph[transaction.fromAccount] = [];
    }

    graph[transaction.fromAccount].push(transaction);
}

console.log("Graph:");
console.log(graph);

console.log("\nStarting cycle detection...");

const result = detectCircularFlows(graph);

console.log("\nResult:");
console.log(result);