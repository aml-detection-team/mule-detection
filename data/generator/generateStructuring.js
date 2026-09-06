const accounts = require("../output/accounts.json");

function generateStructuring(scenarioNumber) {
  const structuringTransactions = [];

  // Define the threshold; can be changed later
  const structuringThreshold = 50000;

  const senderIndex = Math.floor(Math.random() * accounts.length);

  let receiverIndex = Math.floor(Math.random() * accounts.length);

  while (senderIndex === receiverIndex) {
    receiverIndex = Math.floor(Math.random() * accounts.length);
  }

  const senderId = accounts[senderIndex].accountId;
  const receiverId = accounts[receiverIndex].accountId;

  const numberOfTransactions = Math.floor(Math.random() * 3) + 4;

  let startTime = new Date();

  // Aggregate total above threshold
  const targetTotal = Math.floor(Math.random() * 40001) + 60000;

  let remaining = targetTotal;

  for (let i = 0; i < numberOfTransactions; i++) {
    // Money that can safely be given to this transaction
    // while still allowing valid remaining transactions
    const remainingTransactions = numberOfTransactions - i - 1;

    const minAmount = Math.max(
      10000,
      remaining - remainingTransactions * 49999,
    );

    const maxAmount = Math.min(
      49999,
      remaining - remainingTransactions * 10000,
    );

    const amount =
      Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount;

    remaining -= amount;

    const gapMinutes = Math.floor(Math.random() * 10) + 1;

    startTime = new Date(startTime.getTime() + gapMinutes * 60 * 1000);

    const transaction = {
      transactionId:
        "STRUCTURE_" +
        String(scenarioNumber).padStart(3, "0") +
        "_TX_" +
        (i + 1),
      fromAccount: senderId,
      toAccount: receiverId,
      amount,
      currency: "INR",
      timestamp: startTime.toISOString(),
    };

    structuringTransactions.push(transaction);
  }

  const groundTruth = {
    scenarioId: "STRUCTURE_" + String(scenarioNumber).padStart(3, "0"),
    pattern: "structuring",
    accountIds: [senderId, receiverId],
    transactionIds: structuringTransactions.map(
      (transaction) => transaction.transactionId,
    ),
  };

  return {
    transactions: structuringTransactions,
    groundTruth,
  };
}

module.exports = generateStructuring;
