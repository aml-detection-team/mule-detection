function detectCircularFlows(graph) {
    const path = [];
    const transactionPath = [];
    const transactionObjects = [];

    function dfs(account) {
        path.push(account);

        const transactions = graph[account] || [];

        for (const transaction of transactions) {
            const nextAccount = transaction.toAccount;

            transactionPath.push(transaction.transactionId);
            transactionObjects.push(transaction);

            if (path.includes(nextAccount)) {
                const cycleStart = path.indexOf(nextAccount);

                const cycleTransactions =
                    transactionObjects.slice(cycleStart);

                const amounts = cycleTransactions.map(
                    transaction => transaction.amount
                );

                const allAmountsSame = amounts.every(
                    amount => amount === amounts[0]
                );

                if (allAmountsSame) {
                    return {
                        accountIds: path.slice(cycleStart),
                        transactionIds: transactionPath.slice(cycleStart),
                        transactions: cycleTransactions
                    };
                }
            } else {
                const result = dfs(nextAccount);

                if (result) {
                    return result;
                }
            }

            transactionObjects.pop();
            transactionPath.pop();
        }

        path.pop();
    }

    for (const account in graph) {
        const result = dfs(account);

        if (result) {
            return result;
        }
    }

    return null;
}

export default detectCircularFlows;