import fs from "fs";
import detectRapidMoneyMovement from "./services/detection/rapidMoneyMovement.js";

const transactions = JSON.parse(
    fs.readFileSync("data/output/transactions.json", "utf-8")
);

const result = detectRapidMoneyMovement(transactions);

console.log("Rapid money movements:");
console.dir(result, { depth: null });

console.log(
    "Total rapid movements detected:",
    result.length
);