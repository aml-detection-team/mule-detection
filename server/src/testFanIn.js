import fs from "fs";
import detectFanIn from "./services/detection/fanIn.js";

const transactions = JSON.parse(
    fs.readFileSync(
        "data/output/transactions.json",
        "utf8"
    )
);

console.log(
    "Total transactions:",
    transactions.length
);

console.log("\nStarting fan-in detection...");

const startTime = Date.now();

const results =
    detectFanIn(transactions);

const endTime = Date.now();

console.log("Fan-in detection finished!");

console.log(
    "Time taken:",
    ((endTime - startTime) / 1000).toFixed(2),
    "seconds"
);

console.log(
    "Total fan-in patterns detected:",
    results.length
);

for (const result of results) {

    console.log(
        "\n=============================="
    );

    console.log(
        "Receiver:",
        result.accountId
    );

    console.log(
        "Senders:",
        result.senderAccounts.join(" → ")
    );

    console.log(
        "Transactions:",
        result.transactionIds.join(", ")
    );
}