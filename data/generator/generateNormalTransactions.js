const accounts = require("../output/accounts.json");
const fs=require("fs")



const transactions = []
for (let i = 1; i <= 30; i++) {
  const randomFromIndex = Math.floor(Math.random() * accounts.length)
const fromAccount = accounts[randomFromIndex].accountId

let randomToIndex = Math.floor(Math.random() * accounts.length)


while (randomFromIndex === randomToIndex) {
  randomToIndex = Math.floor(Math.random() * accounts.length);
}
const toAccount = accounts[randomToIndex].accountId
const amount = Math.floor(Math.random() * 49001) + 1000

  const transaction = {
    transactionId: "TX" + i.toString().padStart(3, "0"),
    fromAccount,
    toAccount,
    amount,
    currency: "INR",
    timestamp: new Date().toISOString()
  };
  transactions.push(transaction);
}
fs.writeFileSync(
    "data/output/normalTransactions.json",
    JSON.stringify(transactions, null, 2)
);

//console.log(transactions);