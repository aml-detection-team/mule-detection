import fs from "fs";
import buildGraph from "./services/detection/graph.js";
import detectCircularFlows from "./services/detection/circularFlow.js";

const transactions = JSON.parse(
    fs.readFileSync("data/output/transactions.json", "utf-8")
);

console.log("Total transactions:", transactions.length);

// --------------------------------
// Build graph
// --------------------------------

const graph = buildGraph(transactions);

console.log(
    "Accounts in graph:",
    Object.keys(graph).length
);

// --------------------------------
// Only look for cycles up to 10 accounts
// --------------------------------

console.log("Starting cycle detection...");

const startTime = Date.now();

const cycles = detectCircularFlows(graph);

const endTime = Date.now();

console.log("Cycle detection finished!");

console.log(
    "Time taken:",
    ((endTime - startTime) / 1000).toFixed(2),
    "seconds"
);

console.log(
    "Total cycles detected:",
    cycles.length
);

// --------------------------------
// Print detected cycles
// --------------------------------

for (const cycle of cycles) {

    console.log("\n==============================");

    console.log(
        "Accounts:",
        cycle.accountIds.join(" → ")
    );

    console.log(
        "Transactions:",
        cycle.transactionIds.join(", ")
    );

    console.log(
        "Amount:",
        cycle.transactions[0]?.amount
    );
}