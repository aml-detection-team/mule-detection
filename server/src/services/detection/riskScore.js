function calculateRiskScore(circularFlow) {
    let score = 0;
    const reasons = [];

    if (!circularFlow) {
        return {
            score: 0,
            riskLevel: "LOW",
            reasons: []
        };
    }

    // Circular money flow detected
    score += 40;

    reasons.push("Circular money flow detected");

    // Multiple accounts involved in the cycle
    if (circularFlow.accountIds.length >= 4) {
        score += 20;

        reasons.push(
            `${circularFlow.accountIds.length} accounts involved in the cycle`
        );
    }

    // Multiple transactions involved
    if (circularFlow.transactionIds.length >= 4) {
        score += 20;

        reasons.push(
            `${circularFlow.transactionIds.length} transactions involved in the cycle`
        );
    }

    // Same transaction amount across the cycle
    const amounts = circularFlow.transactions.map(
        transaction => transaction.amount
    );

    const allAmountsSame = amounts.every(
        amount => amount === amounts[0]
    );

    if (allAmountsSame) {
        score += 20;

        reasons.push(
            `Same transaction amount across the cycle: ₹${amounts[0]}`
        );
    }

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