function adaptDetectionResults(result, allTransactions) {
    const alerts = [];

    /*
     * ---------------------------------------------------------
     * Helper: Find transaction by ID
     * ---------------------------------------------------------
     */

    function findTransaction(transactionId) {
        if (!Array.isArray(allTransactions)) {
            return null;
        }

        return allTransactions.find(
            (tx) =>
                tx.transactionId === transactionId ||
                tx.id === transactionId
        );
    }

    /*
     * ---------------------------------------------------------
     * Helper: Add reason only once
     * ---------------------------------------------------------
     */

    function addReason(reasons, reason) {
        if (!reasons.includes(reason)) {
            reasons.push(reason);
        }
    }

    /*
     * ---------------------------------------------------------
     * 1. Circular Flow Alerts
     * ---------------------------------------------------------
     */

    if (Array.isArray(result.circularFlow)) {

        result.circularFlow.forEach((flow) => {

            const transactions =
                Array.isArray(flow.transactions)
                    ? flow.transactions.map((tx) => ({
                        id: tx.transactionId,
                        from: tx.fromAccount,
                        to: tx.toAccount,
                        amount: tx.amount,
                        timestamp: tx.timestamp
                    }))
                    : [];

            /*
             * Find account risks belonging to this flow.
             */

            const involvedAccountRisks =
                Array.isArray(result.accountRisks)
                    ? result.accountRisks.filter(
                        (accountRisk) =>
                            flow.accountIds.includes(
                                accountRisk.accountId
                            )
                    )
                    : [];

            /*
             * Find highest risk score.
             */

            let highestScore = 0;
            let highestRiskLevel = "LOW";

            involvedAccountRisks.forEach(
                (accountRisk) => {

                    const currentScore =
                        accountRisk.score ??
                        accountRisk.riskScore ??
                        0;

                    if (currentScore > highestScore) {

                        highestScore = currentScore;

                        highestRiskLevel =
                            accountRisk.riskLevel ??
                            "LOW";
                    }
                }
            );

            /*
             * Fallback to overall risk.
             */

            if (
                highestScore === 0 &&
                result.riskResult
            ) {

                highestScore =
                    result.riskResult.score ?? 0;

                highestRiskLevel =
                    result.riskResult.riskLevel ??
                    "LOW";
            }

            /*
             * Build reasons.
             */

            const reasons = [
                "Circular money flow detected",
                `${flow.accountIds.length} accounts involved in the circular flow`,
                `${flow.transactionIds.length} transactions involved in the circular flow`
            ];

            /*
             * Check whether all amounts are identical.
             */

            const amounts =
                transactions.map(
                    (tx) => tx.amount
                );

            if (
                amounts.length > 0 &&
                amounts.every(
                    (amount) =>
                        amount === amounts[0]
                )
            ) {

                reasons.push(
                    `Same transaction amount across the cycle: ₹${amounts[0]}`
                );
            }

            /*
             * Create circular-flow alert.
             */

            alerts.push({

                pattern: {
                    type: "circular_flow"
                },

                risk: {
                    score: highestScore,
                    level: highestRiskLevel,
                    reasons
                },

                evidence: {

                    accountIds:
                        flow.accountIds,

                    transactionIds:
                        flow.transactionIds,

                    transactions
                }
            });
        });
    }

    /*
     * ---------------------------------------------------------
     * 2. Rapid Money Movement Alerts
     * ---------------------------------------------------------
     */

    if (
        Array.isArray(
            result.rapidMoneyMovements
        )
    ) {

        result.rapidMoneyMovements.forEach(
            (movement) => {

                /*
                 * Find incoming transaction.
                 */

                const incomingTransaction =
                    findTransaction(
                        movement.incomingTransactionId
                    );

                /*
                 * Find outgoing transaction.
                 */

                const outgoingTransaction =
                    findTransaction(
                        movement.outgoingTransactionId
                    );

                /*
                 * Build transaction evidence.
                 */

                const movementTransactions = [];

                if (incomingTransaction) {

                    movementTransactions.push({
                        id:
                            incomingTransaction.transactionId ??
                            incomingTransaction.id,

                        from:
                            incomingTransaction.fromAccount ??
                            incomingTransaction.from,

                        to:
                            incomingTransaction.toAccount ??
                            incomingTransaction.to,

                        amount:
                            incomingTransaction.amount,

                        timestamp:
                            incomingTransaction.timestamp
                    });
                }

                if (outgoingTransaction) {

                    movementTransactions.push({
                        id:
                            outgoingTransaction.transactionId ??
                            outgoingTransaction.id,

                        from:
                            outgoingTransaction.fromAccount ??
                            outgoingTransaction.from,

                        to:
                            outgoingTransaction.toAccount ??
                            outgoingTransaction.to,

                        amount:
                            outgoingTransaction.amount,

                        timestamp:
                            outgoingTransaction.timestamp
                    });
                }

                /*
                 * -------------------------------------------------
                 * Find account risk
                 * -------------------------------------------------
                 */

                const accountRisk =
                    Array.isArray(result.accountRisks)
                        ? result.accountRisks.find(
                            (risk) =>
                                risk.accountId ===
                                movement.accountId
                        )
                        : null;

                /*
                 * Default risk.
                 */

                let score = 0;
                let level = "LOW";

                if (accountRisk) {

                    score =
                        accountRisk.score ??
                        accountRisk.riskScore ??
                        0;

                    level =
                        accountRisk.riskLevel ??
                        "LOW";
                }

                /*
                 * -------------------------------------------------
                 * Build reasons
                 * -------------------------------------------------
                 */

                const reasons = [
                    "Rapid money movement detected",

                    `Incoming transaction ${movement.incomingTransactionId} followed by outgoing transaction ${movement.outgoingTransactionId}`,

                    `Time difference: ${movement.timeDifferenceMinutes} minutes`
                ];

                /*
                 * Amount ratio.
                 */

                if (
                    movement.amountRatio !==
                        undefined &&
                    movement.amountRatio !==
                        null
                ) {

                    addReason(
                        reasons,
                        `Amount ratio: ${movement.amountRatio}`
                    );
                }

                /*
                 * Add account-risk information.
                 */

                if (accountRisk) {

                    if (
                        accountRisk.circularFlowCount >
                        0
                    ) {

                        addReason(
                            reasons,
                            "Participated in circular money flow"
                        );
                    }

                    /*
                     * Add circular-flow reasons.
                     *
                     * We only want the useful
                     * cycle-specific information.
                     */

                    if (
                        Array.isArray(
                            accountRisk.reasons
                        )
                    ) {

                        accountRisk.reasons.forEach(
                            (reason) => {

                                if (
                                    reason !==
                                    "Participated in circular money flow" &&
                                    !reason.includes(
                                        "rapid money movement(s) detected"
                                    ) &&
                                    reason !==
                                    "Repeated rapid money movement activity"
                                ) {

                                    addReason(
                                        reasons,
                                        reason
                                    );
                                }
                            }
                        );
                    }

                    /*
                     * If account has multiple rapid movements,
                     * add one clean explanation.
                     */

                    if (
                        accountRisk.rapidMovementCount >
                        1
                    ) {

                        addReason(
                            reasons,
                            "Repeated rapid money movement activity"
                        );
                    }
                }

                /*
                 * -------------------------------------------------
                 * Create alert
                 * -------------------------------------------------
                 */

                alerts.push({

                    pattern: {
                        type:
                            "rapid_money_movement"
                    },

                    risk: {
                        score,
                        level,
                        reasons
                    },

                    evidence: {

                        accountIds: [
                            movement.accountId
                        ],

                        transactionIds: [
                            movement.incomingTransactionId,
                            movement.outgoingTransactionId
                        ],

                        transactions:
                            movementTransactions
                    }
                });
            }
        );
    }

    /*
     * ---------------------------------------------------------
     * Final standardized B → C contract
     * ---------------------------------------------------------
     */

    return {
        alerts
    };
}

export default adaptDetectionResults;