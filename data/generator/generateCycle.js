const accounts = require("../output/accounts.json");

function generateCycle(scenarioNumber) {
  const cycleSize = Math.floor(Math.random() * 3) + 4;

  const cycleAccounts = [];

  while (cycleAccounts.length < cycleSize) {
    const randomIndex = Math.floor(Math.random() * accounts.length);

    const accountId = accounts[randomIndex].accountId;

    if (!cycleAccounts.includes(accountId)) {
      cycleAccounts.push(accountId);
    }
  }

  const cycleTransactions = [];

  for (let i = 0; i < cycleAccounts.length; i++) {
    const fromAccount = cycleAccounts[i];

    const toAccount = cycleAccounts[(i + 1) % cycleAccounts.length];

    const transaction = {
      transactionId:
        "CYCLE_" + String(scenarioNumber).padStart(3, "0") + "_TX_" + (i + 1),
      fromAccount,
      toAccount,
      amount: 25000,
      currency: "INR",
      timestamp: new Date().toISOString(),
    };

    cycleTransactions.push(transaction);
  }

  const groundTruth = {
    scenarioId: "CYCLE_" + String(scenarioNumber).padStart(3, "0"),
    pattern: "circular_flow",
    accountIds: cycleAccounts,
    transactionIds: cycleTransactions.map(
      (transaction) => transaction.transactionId,
    ),
  };

  return {
    transactions: cycleTransactions,
    groundTruth,
  };
}

module.exports = generateCycle;
