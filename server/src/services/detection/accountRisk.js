function generateAccountRisk(
    circularFlows,
    rapidMoneyMovements
) {

    const accountRisk = {};

    // --------------------------------
    // Process circular flows
    // --------------------------------

    for (const circularFlow of circularFlows) {

        for (const accountId of circularFlow.accountIds) {

            if (!accountRisk[accountId]) {

                accountRisk[accountId] = {
                    accountId,
                    score: 0,
                    reasons: []
                };
            }

            // Circular flow involvement
            accountRisk[accountId].score += 40;

            if (
                !accountRisk[accountId].reasons.includes(
                    "Participated in circular money flow"
                )
            ) {
                accountRisk[accountId].reasons.push(
                    "Participated in circular money flow"
                );
            }

            // Large cycle
            if (circularFlow.accountIds.length >= 4) {

                accountRisk[accountId].score += 10;

                const reason =
                    `${circularFlow.accountIds.length} accounts involved in cycle`;

                if (
                    !accountRisk[accountId].reasons.includes(reason)
                ) {
                    accountRisk[accountId].reasons.push(reason);
                }
            }

            // Same transaction amount
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
                    !accountRisk[accountId].reasons.includes(reason)
                ) {
                    accountRisk[accountId].reasons.push(reason);
                }
            }
        }
    }

    // --------------------------------
    // Process rapid money movements
    // --------------------------------

    for (const movement of rapidMoneyMovements) {

        const accountId =
            movement.accountId;

        if (!accountRisk[accountId]) {

            accountRisk[accountId] = {
                accountId,
                score: 0,
                reasons: []
            };
        }

        accountRisk[accountId].score += 10;

        if (
            !accountRisk[accountId].reasons.includes(
                "Rapid money movement detected"
            )
        ) {
            accountRisk[accountId].reasons.push(
                "Rapid money movement detected"
            );
        }
    }

    // --------------------------------
    // Cap account scores at 100
    // --------------------------------

    for (const accountId in accountRisk) {

        if (accountRisk[accountId].score > 100) {

            accountRisk[accountId].score = 100;
        }

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

    return Object.values(accountRisk);
}

export default generateAccountRisk;