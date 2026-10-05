function generateAccountRisk(
    circularFlows,
    rapidMoneyMovements
) {

    const accountRisk = {};

    // --------------------------------
    // Helper function
    // --------------------------------

    function createAccount(accountId) {

        if (!accountRisk[accountId]) {

            accountRisk[accountId] = {
                accountId,
                score: 0,
                reasons: [],
                circularFlowCount: 0,
                rapidMovementCount: 0
            };
        }
    }

    // --------------------------------
    // 1. Process circular flows
    // --------------------------------

    for (const circularFlow of circularFlows) {

        for (const accountId of circularFlow.accountIds) {

            createAccount(accountId);

            // --------------------------------
            // Circular flow involvement
            // --------------------------------

            accountRisk[accountId].score += 40;

            accountRisk[accountId].circularFlowCount += 1;

            if (
                !accountRisk[accountId].reasons.includes(
                    "Participated in circular money flow"
                )
            ) {

                accountRisk[accountId].reasons.push(
                    "Participated in circular money flow"
                );
            }

            // --------------------------------
            // Large cycle
            // --------------------------------

            if (
                circularFlow.accountIds.length >= 4
            ) {

                accountRisk[accountId].score += 10;

                const reason =
                    `${circularFlow.accountIds.length} accounts involved in cycle`;

                if (
                    !accountRisk[accountId].reasons.includes(
                        reason
                    )
                ) {

                    accountRisk[accountId].reasons.push(
                        reason
                    );
                }
            }

            // --------------------------------
            // Many transactions
            // --------------------------------

            if (
                circularFlow.transactionIds.length >= 4
            ) {

                accountRisk[accountId].score += 10;

                const reason =
                    `${circularFlow.transactionIds.length} transactions involved in cycle`;

                if (
                    !accountRisk[accountId].reasons.includes(
                        reason
                    )
                ) {

                    accountRisk[accountId].reasons.push(
                        reason
                    );
                }
            }

            // --------------------------------
            // Same transaction amount
            // --------------------------------

            const amounts =
                circularFlow.transactions.map(
                    transaction =>
                        transaction.amount
                );

            const allAmountsSame =
                amounts.length > 0 &&
                amounts.every(
                    amount =>
                        amount === amounts[0]
                );

            if (allAmountsSame) {

                accountRisk[accountId].score += 10;

                const reason =
                    `Same transaction amount across cycle: ₹${amounts[0]}`;

                if (
                    !accountRisk[accountId].reasons.includes(
                        reason
                    )
                ) {

                    accountRisk[accountId].reasons.push(
                        reason
                    );
                }
            }
        }
    }

    // --------------------------------
    // 2. Process rapid money movements
    // --------------------------------

    for (
        const movement
        of rapidMoneyMovements
    ) {

        const accountId =
            movement.accountId;

        createAccount(accountId);

        accountRisk[accountId].rapidMovementCount += 1;
    }

    // --------------------------------
    // 3. Add rapid movement risk
    // --------------------------------

    for (
        const accountId
        in accountRisk
    ) {

        const account =
            accountRisk[accountId];

        const rapidCount =
            account.rapidMovementCount;

        if (rapidCount > 0) {

            // Base rapid movement risk
            account.score += 10;

            account.reasons.push(
                `${rapidCount} rapid money movement(s) detected`
            );

            // --------------------------------
            // Repeated rapid movement
            // --------------------------------

            if (rapidCount >= 3) {

                account.score += 10;

                account.reasons.push(
                    "Repeated rapid money movement activity"
                );
            }

            // --------------------------------
            // High rapid activity
            // --------------------------------

            if (rapidCount >= 5) {

                account.score += 10;

                account.reasons.push(
                    "High rapid money movement activity"
                );
            }
        }
    }

    // --------------------------------
    // 4. Cap scores at 100
    // --------------------------------

    for (
        const accountId
        in accountRisk
    ) {

        if (
            accountRisk[accountId].score > 100
        ) {

            accountRisk[accountId].score = 100;
        }

        // --------------------------------
        // Determine risk level
        // --------------------------------

        const score =
            accountRisk[accountId].score;

        if (score >= 80) {

            accountRisk[accountId].riskLevel =
                "CRITICAL";

        } else if (score >= 60) {

            accountRisk[accountId].riskLevel =
                "HIGH";

        } else if (score >= 30) {

            accountRisk[accountId].riskLevel =
                "MEDIUM";

        } else {

            accountRisk[accountId].riskLevel =
                "LOW";
        }
    }

    // --------------------------------
    // 5. Return clean account objects
    // --------------------------------

    return Object.values(accountRisk).map(
        account => {

            return {
                accountId: account.accountId,
                score: account.score,
                riskLevel: account.riskLevel,
                reasons: account.reasons,
                circularFlowCount:
                    account.circularFlowCount,
                rapidMovementCount:
                    account.rapidMovementCount
            };
        }
    );
}

export default generateAccountRisk;