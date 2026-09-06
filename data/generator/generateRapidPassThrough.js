const accounts = require("../output/accounts.json");

function generateRapidPassThrough(scenarioNumber) {
  const rapidPassThroughTransactions = [];

  const chainLength = Math.floor(Math.random() * 3) + 4;

  const chainAccounts = [];

  while (chainAccounts.length < chainLength) {
    const randomIndex = Math.floor(Math.random() * accounts.length);

    const accountId = accounts[randomIndex].accountId;

    if (!chainAccounts.includes(accountId)) {
      chainAccounts.push(accountId);
    }
  }

  let currentAmount = Math.floor(Math.random() * 40001) + 10000;

  let currentTime = new Date();

  for (let i = 0; i < chainAccounts.length - 1; i++) {
    const fromAccount = chainAccounts[i];

    const toAccount = chainAccounts[i + 1];

    const gapMinutes = Math.floor(Math.random() * 5) + 1;

    currentTime = new Date(currentTime.getTime() + gapMinutes * 60 * 1000);

    const transaction = {
      transactionId:
        "RAPID_" + String(scenarioNumber).padStart(3, "0") + "_TX_" + (i + 1),
      fromAccount,
      toAccount,
      amount: currentAmount,
      currency: "INR",
      timestamp: currentTime.toISOString(),
    };

    rapidPassThroughTransactions.push(transaction);

    const passThroughLoss = Math.floor(Math.random() * 1001);

    currentAmount -= passThroughLoss;
  }

  const groundTruth = {
    scenarioId: "RAPID_" + String(scenarioNumber).padStart(3, "0"),
    pattern: "rapid_pass_through",
    accountIds: chainAccounts,
    transactionIds: rapidPassThroughTransactions.map(
      (transaction) => transaction.transactionId,
    ),
  };

  return {
    transactions: rapidPassThroughTransactions,
    groundTruth,
  };
}

module.exports = generateRapidPassThrough;
