function calculateRiskScore(
    circularFlows,
    rapidMoneyMovements
) {

    let score = 0;

    const reasons = [];

    // --------------------------------
    // 1. Circular money flows
    // --------------------------------

    if (circularFlows.length > 0) {

        // Base score
        score += 40;

        reasons.push(
            `${circularFlows.length} circular money flow(s) detected`
        );

        // Examine each circular flow
        for (const circularFlow of circularFlows) {

            // --------------------------------
            // Large cycle
            // --------------------------------

            if (
                circularFlow.accountIds.length >= 4
            ) {

                score += 10;

                reasons.push(
                    `${circularFlow.accountIds.length} accounts involved in a circular flow`
                );
            }

            // --------------------------------
            // Many transactions
            // --------------------------------

            if (
                circularFlow.transactionIds.length >= 4
            ) {

                score += 10;

                reasons.push(
                    `${circularFlow.transactionIds.length} transactions involved in a circular flow`
                );
            }

            // --------------------------------
            // Same amount
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

                score += 10;

                reasons.push(
                    `Same transaction amount across the cycle: ₹${amounts[0]}`
                );
            }
        }
    }

    // --------------------------------
    // 2. Rapid money movement
    // --------------------------------

    if (
        rapidMoneyMovements.length > 0
    ) {

        // Give a base score for rapid movement
        score += 10;

        reasons.push(
            `${rapidMoneyMovements.length} rapid money movement(s) detected`
        );

        // --------------------------------
        // Multiple rapid movements
        // --------------------------------

        if (
            rapidMoneyMovements.length >= 5
        ) {

            score += 10;

            reasons.push(
                "High number of rapid money movements detected"
            );
        }

        // --------------------------------
        // Very high rapid activity
        // --------------------------------

        if (
            rapidMoneyMovements.length >= 10
        ) {

            score += 10;

            reasons.push(
                "Very high rapid money movement activity detected"
            );
        }
    }

    // --------------------------------
    // Prevent score > 100
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