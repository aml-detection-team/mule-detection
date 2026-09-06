const accounts = require("../output/accounts.json");

function generateFanIn(scenarioNumber) {
  const fanInAccounts = [];

  const fanInTransactions = [];

  const numberOfSenders = Math.floor(Math.random() * 3) + 4;

  const receiverIndex = Math.floor(Math.random() * accounts.length);

  const receiverAccount = accounts[receiverIndex].accountId;

  while (fanInAccounts.length < numberOfSenders) {
    const senderIndex = Math.floor(Math.random() * accounts.length);

    const accountId = accounts[senderIndex].accountId;

    if (accountId !== receiverAccount && !fanInAccounts.includes(accountId)) {
      fanInAccounts.push(accountId);
    }
  }

  // Generate the fan-in transactions
  for (let i = 0; i < fanInAccounts.length; i++) {
    const fromAccount = fanInAccounts[i];

    const toAccount = receiverAccount;

    const transaction = {
      transactionId:
        "FANIN_" + String(scenarioNumber).padStart(3, "0") + "_TX_" + (i + 1),
      fromAccount,
      toAccount,
      amount: Math.floor(Math.random() * 40001) + 10000,
      currency: "INR",
      timestamp: new Date().toISOString(),
    };

    fanInTransactions.push(transaction);
  }

  const groundTruth = {
    scenarioId: "FANIN_" + String(scenarioNumber).padStart(3, "0"),
    pattern: "fan_in",
    accountIds: [...fanInAccounts, receiverAccount],
    transactionIds: fanInTransactions.map(
      (transaction) => transaction.transactionId,
    ),
  };

  return {
    transactions: fanInTransactions,
    groundTruth,
  };
}

module.exports = generateFanIn;
