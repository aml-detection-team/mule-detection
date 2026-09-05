import fs from "fs";

import buildGraph from "./services/detection/graph.js";
import detectCircularFlows from "./services/detection/circularFlow.js";

const transactions = JSON.parse(
    fs.readFileSync("data/output/transactions.json", "utf-8")
);

const graph = buildGraph(transactions);

const circularFlow = detectCircularFlows(graph);

console.log("Detected circular flow:");
console.log(circularFlow);