import fs from "fs";

const transactions = JSON.parse(
    fs.readFileSync("data/output/transactions.json", "utf-8")
);

const cycleIds = [
    "TX0885",
    "TX0684",
    "TX1009",
    "TX0785",
    "TX0865"
];

console.log("Checking CYCLE_001 transactions...\n");

const cycleTransactions = transactions.filter(
    transaction =>
        cycleIds.includes(transaction.transactionId)
);

for (const transaction of cycleTransactions) {
    console.log(
        `${transaction.transactionId} | ` +
        `${transaction.fromAccount} → ${transaction.toAccount} | ` +
        `₹${transaction.amount}`
    );
}

console.log("\nChecking ALL transactions involving these accounts...\n");

const accounts = new Set();

for (const transaction of cycleTransactions) {
    accounts.add(transaction.fromAccount);
    accounts.add(transaction.toAccount);
}

for (const transaction of transactions) {

    if (
        accounts.has(transaction.fromAccount) ||
        accounts.has(transaction.toAccount)
    ) {
        console.log(
            `${transaction.transactionId} | ` +
            `${transaction.fromAccount} → ${transaction.toAccount} | ` +
            `₹${transaction.amount}`
        );
    }
}