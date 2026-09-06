function generateAccountRisk(circularFlow, rapidMoneyMovements) {
    const accountRiskMap = {};

    // --------------------------------
    // 1. Add accounts involved in cycle
    // --------------------------------

    if (circularFlow) {
        for (const accountId of circularFlow.accountIds) {
            accountRiskMap[accountId] = {
                accountId,
                riskScore: 40,
                reasons: [
                    "Participated in circular money flow"
                ]
            };

            // 4+ accounts
            if (circularFlow.accountIds.length >= 4) {
                accountRiskMap[accountId].riskScore += 10;

                accountRiskMap[accountId].reasons.push(
                    "Part of a cycle involving 4 or more accounts"
                );
            }

            // 4+ transactions
            if (circularFlow.transactionIds.length >= 4) {
                accountRiskMap[accountId].riskScore += 10;

                accountRiskMap[accountId].reasons.push(
                    "Part of a cycle involving 4 or more transactions"
                );
            }

            // Same amount across cycle
            const amounts = circularFlow.transactions.map(
                transaction => transaction.amount
            );

            const allAmountsSame = amounts.every(
                amount => amount === amounts[0]
            );

            if (allAmountsSame) {
                accountRiskMap[accountId].riskScore += 10;

                accountRiskMap[accountId].reasons.push(
                    `Same transaction amount across cycle: ₹${amounts[0]}`
                );
            }
        }
    }

    // --------------------------------
    // 2. Add rapid money movement risk
    // --------------------------------

    for (const movement of rapidMoneyMovements) {
        const accountId = movement.accountId;

        // If account hasn't appeared before,
        // create it with score 0
        if (!accountRiskMap[accountId]) {
            accountRiskMap[accountId] = {
                accountId,
                riskScore: 0,
                reasons: []
            };
        }

        // Each rapid movement = +5
        accountRiskMap[accountId].riskScore += 5;

        accountRiskMap[accountId].reasons.push(
            `Rapid money movement detected: ${movement.incomingTransactionId} → ${movement.outgoingTransactionId}`
        );
    }

    // --------------------------------
    // 3. Cap score at 100
    // --------------------------------

    for (const accountId in accountRiskMap) {
        if (accountRiskMap[accountId].riskScore > 100) {
            accountRiskMap[accountId].riskScore = 100;
        }
    }

    // --------------------------------
    // 4. Determine risk level
    // --------------------------------

    for (const accountId in accountRiskMap) {
        const score = accountRiskMap[accountId].riskScore;

        if (score >= 80) {
            accountRiskMap[accountId].riskLevel = "CRITICAL";
        } else if (score >= 60) {
            accountRiskMap[accountId].riskLevel = "HIGH";
        } else if (score >= 30) {
            accountRiskMap[accountId].riskLevel = "MEDIUM";
        } else {
            accountRiskMap[accountId].riskLevel = "LOW";
        }
    }

    return Object.values(accountRiskMap);
}

export default generateAccountRisk;