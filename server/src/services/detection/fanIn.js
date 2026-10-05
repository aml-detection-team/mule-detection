function detectFanIn(transactions) {

    const incomingAccounts = {};

    // --------------------------------
    // Group transactions by receiver
    // --------------------------------

    for (const transaction of transactions) {

        const receiver = transaction.toAccount;
        const sender = transaction.fromAccount;

        if (!incomingAccounts[receiver]) {
            incomingAccounts[receiver] = [];
        }

        incomingAccounts[receiver].push(transaction);
    }

    // --------------------------------
    // Find accounts receiving money
    // from many different accounts
    // --------------------------------

    const suspiciousFanIn = [];

    for (const receiver in incomingAccounts) {

        const receiverTransactions =
            incomingAccounts[receiver];

        const uniqueSenders = new Set();

        for (const transaction of receiverTransactions) {

            uniqueSenders.add(
                transaction.fromAccount
            );
        }

        // --------------------------------
        // Fan-in threshold
        // --------------------------------

        if (uniqueSenders.size >= 4) {

            suspiciousFanIn.push({

                accountId: receiver,

                senderAccounts:
                    [...uniqueSenders],

                transactionIds:
                    receiverTransactions.map(
                        transaction =>
                            transaction.transactionId
                    ),

                transactions:
                    receiverTransactions
            });
        }
    }

    return suspiciousFanIn;
}

export default detectFanIn;