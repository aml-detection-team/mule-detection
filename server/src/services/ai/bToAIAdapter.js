function adaptBOutput(detectionResult) {
    if (!detectionResult) {
        throw new Error("Detection result is required");
    }

    const {
        circularFlow,
        riskResult
    } = detectionResult;

    if (!circularFlow) {
        return {
            alerts: []
        };
    }

    const transactions = circularFlow.transactions || [];

    const transactionIds =
        circularFlow.transactionIds ||
        transactions.map(
            transaction => transaction.transactionId
        );

    const accountIds =
        circularFlow.accountIds || [];

    return {
        alerts: [
            {
                pattern: {
                    type: "circular_flow"
                },

                risk: {
                    score: riskResult?.score ?? 0,
                    level: riskResult?.riskLevel ?? "LOW",
                    reasons: riskResult?.reasons || []
                },

                evidence: {
                    accountIds,

                    transactionIds,

                    transactions: transactions.map(
                        transaction => ({
                            id: transaction.transactionId,
                            from: transaction.fromAccount,
                            to: transaction.toAccount,
                            amount: transaction.amount,
                            currency: transaction.currency,
                            timestamp: transaction.timestamp
                        })
                    )
                }
            }
        ]
    };
}

export default adaptBOutput;