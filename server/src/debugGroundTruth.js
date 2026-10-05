import fs from "fs";

const transactions = JSON.parse(
    fs.readFileSync(
        "data/output/transactions.json",
        "utf8"
    )
);

const groundTruth = JSON.parse(
    fs.readFileSync(
        "data/output/groundTruth.json",
        "utf8"
    )
);

const transactionMap = {};

for (const transaction of transactions) {

    transactionMap[transaction.transactionId] =
        transaction;
}

for (const scenario of groundTruth) {

    // Only show circular flow scenarios
    if (scenario.pattern !== "circular_flow") {
        continue;
    }

    console.log("\n==============================");
    console.log(scenario.scenarioId);
    console.log("==============================");

    console.log(
        "Expected accounts:",
        scenario.accountIds.join(" → ")
    );

    console.log("Transactions:");

    for (const transactionId of scenario.transactionIds) {

        const transaction =
            transactionMap[transactionId];

        if (!transaction) {

            console.log(
                "MISSING:",
                transactionId
            );

            continue;
        }

        console.log(
            transaction.transactionId,
            "|",
            transaction.fromAccount,
            "→",
            transaction.toAccount,
            "| ₹",
            transaction.amount,
            "|",
            transaction.timestamp
        );
    }
}