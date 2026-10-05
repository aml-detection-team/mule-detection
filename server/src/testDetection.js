import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import analyzeTransactions from "./services/detection/analyzetransactions.js";

// --------------------------------
// Get current file directory
// --------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------------------
// Transactions file path
// --------------------------------

const transactionsPath = path.resolve(
    __dirname,
    "../../data/output/transactions.json"
);

console.log("Loading transactions from:");
console.log(transactionsPath);

// --------------------------------
// Load transactions
// --------------------------------

const transactions = JSON.parse(
    fs.readFileSync(
        transactionsPath,
        "utf-8"
    )
);

console.log(
    "Total transactions:",
    transactions.length
);

console.log(
    "Starting analysis..."
);

const result =
    analyzeTransactions(transactions);

console.log(
    "Analysis finished!"
);

// --------------------------------
// Circular flows
// --------------------------------

console.log(
    "Circular flows detected:",
    result.circularFlow.length
);

for (const cycle of result.circularFlow) {

    console.log(
        "\n=============================="
    );

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

// --------------------------------
// Rapid movements
// --------------------------------

console.log(
    "\nRapid movements:",
    result.rapidMoneyMovements.length
);

// --------------------------------
// Overall Risk
// --------------------------------

console.log("\nRisk:");

console.log(result.riskResult);

// --------------------------------
// Account Risks
// --------------------------------

console.log("\nAccount Risks:");

console.log(result.accountRisks);