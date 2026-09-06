const accounts = require("../output/accounts.json");

function generateNormalTransactions() {
  const transactions = [];

  const numberOfTransactions = 1000;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const endDate = new Date();

  for (let i = 1; i <= numberOfTransactions; i++) {
    const randomFromIndex = Math.floor(Math.random() * accounts.length);

    const fromAccount = accounts[randomFromIndex].accountId;

    let randomToIndex = Math.floor(Math.random() * accounts.length);

    while (randomFromIndex === randomToIndex) {
      randomToIndex = Math.floor(Math.random() * accounts.length);
    }

    const toAccount = accounts[randomToIndex].accountId;

    const amount = Math.floor(Math.random() * 49001) + 1000;

    const randomTimestamp = new Date(
      startDate.getTime() +
        Math.random() * (endDate.getTime() - startDate.getTime()),
    ).toISOString();

    const transaction = {
      transactionId: "NORMAL_TX_" + i,
      fromAccount,
      toAccount,
      amount,
      currency: "INR",
      timestamp: randomTimestamp,
    };

    transactions.push(transaction);
  }

  return transactions;
}

module.exports = generateNormalTransactions;
