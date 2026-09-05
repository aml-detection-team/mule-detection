const transactions = [
    {
        transactionId: "TX031",
        fromAccount: "ACC001",
        toAccount: "ACC002",
        amount: 25000,
        currency: "INR",
        timestamp: "2026-09-02T18:04:51.365Z"
    },
    {
        transactionId: "TX032",
        fromAccount: "ACC002",
        toAccount: "ACC003",
        amount: 25000,
        currency: "INR",
        timestamp: "2026-09-02T18:04:51.369Z"
    },
    {
        transactionId: "TX033",
        fromAccount: "ACC003",
        toAccount: "ACC004",
        amount: 25000,
        currency: "INR",
        timestamp: "2026-09-02T18:04:51.369Z"
    },
    {
        transactionId: "TX034",
        fromAccount: "ACC004",
        toAccount: "ACC001",
        amount: 25000,
        currency: "INR",
        timestamp: "2026-09-02T18:04:51.370Z"
    }
];

const response = await fetch("http://localhost:5000/api/detect", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(transactions)
});

const result = await response.json();

console.log("API result:");
console.log(result);