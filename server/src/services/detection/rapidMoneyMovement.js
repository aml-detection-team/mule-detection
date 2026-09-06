function detectRapidMoneyMovement(transactions) {
    const incoming = {};
    const outgoing = {};

    for (const transaction of transactions) {
        const fromAccount = transaction.fromAccount;
        const toAccount = transaction.toAccount;

        if (!incoming[toAccount]) {
            incoming[toAccount] = [];
        }

        if (!outgoing[fromAccount]) {
            outgoing[fromAccount] = [];
        }

        incoming[toAccount].push(transaction);
        outgoing[fromAccount].push(transaction);
    }

    const rapidMovements = [];

    for (const accountId in incoming) {
        if (!outgoing[accountId]) {
            continue;
        }

        for (const incomingTransaction of incoming[accountId]) {
            for (const outgoingTransaction of outgoing[accountId]) {

                const incomingTime = new Date(
                    incomingTransaction.timestamp
                );

                const outgoingTime = new Date(
                    outgoingTransaction.timestamp
                );

                const timeDifference =
                    (outgoingTime - incomingTime) / (1000 * 60);

                const amountRatio =
                    outgoingTransaction.amount /
                    incomingTransaction.amount;

                const isRapid =
                    timeDifference >= 0 &&
                    timeDifference <= 10;

                const isSimilarAmount =
                    amountRatio >= 0.8 &&
                    amountRatio <= 1.2;

                if (isRapid && isSimilarAmount) {
                    rapidMovements.push({
                        accountId,
                        incomingTransactionId:
                            incomingTransaction.transactionId,
                        outgoingTransactionId:
                            outgoingTransaction.transactionId,
                        incomingAmount:
                            incomingTransaction.amount,
                        outgoingAmount:
                            outgoingTransaction.amount,
                        timeDifferenceMinutes:
                            Number(timeDifference.toFixed(2)),
                        amountRatio:
                            Number(amountRatio.toFixed(2))
                    });
                }
            }
        }
    }

    return rapidMovements;
}

export default detectRapidMoneyMovement;