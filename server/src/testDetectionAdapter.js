import fs from "fs";

import analyzeTransactions
    from "./services/detection/analyzetransactions.js";

import adaptDetectionResults
    from "./services/detection/detectionAdapter.js";


// --------------------------------
// Read transactions
// --------------------------------

const transactions = JSON.parse(
    fs.readFileSync(
        "data/output/transactions.json",
        "utf-8"
    )
);

console.log(
    "Total transactions:",
    transactions.length
);


// --------------------------------
// Run detection
// --------------------------------

console.log(
    "Starting analysis..."
);

const result =
    analyzeTransactions(transactions);

console.log(
    "Analysis finished!"
);


// --------------------------------
// Adapt detection result
// --------------------------------

const adaptedResult =
    adaptDetectionResults(result);


// --------------------------------
// Display alerts
// --------------------------------

console.log(
    "\nTotal alerts:",
    adaptedResult.alerts.length
);


adaptedResult.alerts.forEach(
    (alert, index) => {

        console.log(
            "\n=============================="
        );

        console.log(
            "Alert:",
            index + 1
        );

        console.log(
            "Pattern:",
            alert.pattern.type
        );

        console.log(
            "Risk Score:",
            alert.risk.score
        );

        console.log(
            "Risk Level:",
            alert.risk.level
        );

        console.log(
            "Reasons:",
            alert.risk.reasons
        );

        console.log(
            "Accounts:",
            alert.evidence.accountIds
        );

        console.log(
            "Transactions:",
            alert.evidence.transactionIds
        );
    }
);