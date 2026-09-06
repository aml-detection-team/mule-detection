const accounts = require("../output/accounts.json");

function generateFanOut(scenarioNumber) {
  const fanOutAccounts = [];
  const fanOutTransactions = [];

  const numberOfReceivers = Math.floor(Math.random() * 3) + 4;

  const senderIndex = Math.floor(Math.random() * accounts.length);

  const senderAccount = accounts[senderIndex].accountId;

  while (fanOutAccounts.length < numberOfReceivers) {
    const receiverIndex = Math.floor(Math.random() * accounts.length);

    const accountId = accounts[receiverIndex].accountId;

    if (accountId !== senderAccount && !fanOutAccounts.includes(accountId)) {
      fanOutAccounts.push(accountId);
    }
  }

  for (let i = 0; i < fanOutAccounts.length; i++) {
    const fromAccount = senderAccount;
    const toAccount = fanOutAccounts[i];

    const transaction = {
      transactionId:
        "FANOUT_" + String(scenarioNumber).padStart(3, "0") + "_TX_" + (i + 1),
      fromAccount,
      toAccount,
      amount: Math.floor(Math.random() * 40001) + 10000,
      currency: "INR",
      timestamp: new Date().toISOString(),
    };

    fanOutTransactions.push(transaction);
  }

  const groundTruth = {
    scenarioId: "FANOUT_" + String(scenarioNumber).padStart(3, "0"),
    pattern: "fan_out",
    accountIds: [senderAccount, ...fanOutAccounts],
    transactionIds: fanOutTransactions.map(
      (transaction) => transaction.transactionId,
    ),
  };

  return {
    transactions: fanOutTransactions,
    groundTruth,
  };
}

module.exports = generateFanOut;
