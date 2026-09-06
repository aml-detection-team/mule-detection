function detectCircularFlows(graph) {

    const cycles = [];

    // --------------------------------
    // Collect all transactions
    // --------------------------------

    const allTransactions = [];

    for (const account in graph) {

        for (const transaction of graph[account]) {

            allTransactions.push(transaction);
        }
    }

    // --------------------------------
    // Group transactions by amount
    // --------------------------------

    const transactionsByAmount = {};

    for (const transaction of allTransactions) {

        const amount = transaction.amount;

        if (!transactionsByAmount[amount]) {

            transactionsByAmount[amount] = [];
        }

        transactionsByAmount[amount].push(transaction);
    }

    // --------------------------------
    // Search each amount separately
    // --------------------------------

    for (const amount in transactionsByAmount) {

        const transactions =
            transactionsByAmount[amount];

        // --------------------------------
        // Build graph for this amount
        // --------------------------------

        const amountGraph = {};

        for (const transaction of transactions) {

            const from =
                transaction.fromAccount;

            if (!amountGraph[from]) {

                amountGraph[from] = [];
            }

            amountGraph[from].push(transaction);
        }

        // --------------------------------
        // DFS function
        // --------------------------------

        function dfs(
            startAccount,
            currentAccount,
            pathAccounts,
            pathTransactions,
            visited
        ) {

            // Maximum cycle length
            if (pathAccounts.length > 10) {

                return;
            }

            const outgoing =
                amountGraph[currentAccount] || [];

            for (const transaction of outgoing) {

                const nextAccount =
                    transaction.toAccount;

                // --------------------------------
                // Cycle found
                // --------------------------------

                if (nextAccount === startAccount) {

                    const cycleTransactions = [
                        ...pathTransactions,
                        transaction
                    ];

                    cycles.push({

                        accountIds:
                            [...pathAccounts],

                        transactionIds:
                            cycleTransactions.map(
                                t => t.transactionId
                            ),

                        transactions:
                            cycleTransactions
                    });

                    continue;
                }

                // --------------------------------
                // Don't revisit account
                // --------------------------------

                if (visited.has(nextAccount)) {

                    continue;
                }

                // --------------------------------
                // Continue DFS
                // --------------------------------

                visited.add(nextAccount);

                pathAccounts.push(nextAccount);

                pathTransactions.push(transaction);

                dfs(
                    startAccount,
                    nextAccount,
                    pathAccounts,
                    pathTransactions,
                    visited
                );

                // --------------------------------
                // Backtrack
                // --------------------------------

                pathTransactions.pop();

                pathAccounts.pop();

                visited.delete(nextAccount);
            }
        }

        // --------------------------------
        // Start DFS from every account
        // --------------------------------

        for (
            const startAccount
            of Object.keys(amountGraph)
        ) {

            dfs(
                startAccount,
                startAccount,
                [startAccount],
                [],
                new Set([startAccount])
            );
        }
    }

    // --------------------------------
    // Remove duplicate cycles
    // --------------------------------

    const uniqueCycles = [];

    const seen = new Set();

    for (const cycle of cycles) {

        const sortedIds =
            [...cycle.transactionIds]
                .sort()
                .join("|");

        if (!seen.has(sortedIds)) {

            seen.add(sortedIds);

            uniqueCycles.push(cycle);
        }
    }

    return uniqueCycles;
}

export default detectCircularFlows;