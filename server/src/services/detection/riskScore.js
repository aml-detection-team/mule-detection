function calculateRiskScore(
    circularFlow,
    rapidMoneyMovements
) {
    let score = 0;
    const reasons = [];

    // --------------------------------
    // 1. Circular money flow
    // --------------------------------

    if (circularFlow) {
        score += 40;

        reasons.push(
            "Circular money flow detected"
        );

        // 4 or more accounts involved
        if (circularFlow.accountIds.length >= 4) {
            score += 20;

            reasons.push(
                `${circularFlow.accountIds.length} accounts involved in the cycle`
            );
        }

        // 4 or more transactions involved
        if (circularFlow.transactionIds.length >= 4) {
            score += 20;

            reasons.push(
                `${circularFlow.transactionIds.length} transactions involved in the cycle`
            );
        }

        // Same amount across the cycle
        const amounts =
            circularFlow.transactions.map(
                transaction => transaction.amount
            );

        const allAmountsSame =
            amounts.every(
                amount => amount === amounts[0]
            );

        if (allAmountsSame) {
            score += 20;

            reasons.push(
                `Same transaction amount across the cycle: ₹${amounts[0]}`
            );
        }
    }

    // --------------------------------
    // 2. Rapid money movement
    // --------------------------------

    if (rapidMoneyMovements.length > 0) {
        score += 10;

        reasons.push(
            `${rapidMoneyMovements.length} rapid money movements detected`
        );
    }

    // --------------------------------
    // Prevent score from exceeding 100
    // --------------------------------

    if (score > 100) {
        score = 100;
    }

    // --------------------------------
    // Determine risk level
    // --------------------------------

    if (score >= 80) {
        return {
            score,
            riskLevel: "CRITICAL",
            reasons
        };
    }

    if (score >= 60) {
        return {
            score,
            riskLevel: "HIGH",
            reasons
        };
    }

    if (score >= 30) {
        return {
            score,
            riskLevel: "MEDIUM",
            reasons
        };
    }

    return {
        score,
        riskLevel: "LOW",
        reasons
    };
}

export default calculateRiskScore;