import buildGraph from "./services/detection/graph.js";
import transactions from "../../data/output/transactions.json" with { type: "json" };

const graph = buildGraph(transactions);

console.log(graph);