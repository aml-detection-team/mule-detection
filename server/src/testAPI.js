import fs from "fs";

const transactions = JSON.parse(
    fs.readFileSync("data/output/transactions.json", "utf-8")
);

const response = await fetch("http://localhost:5000/api/detect", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(transactions)
});

const result = await response.json();

console.log("API result:");
console.dir(result, { depth: null });