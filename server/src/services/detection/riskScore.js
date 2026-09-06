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

        // Base score for detecting circular flow
        score += 40;

        reasons.push(
            `${circularFlows.length} circular money flow(s) detected`
        );

        // --------------------------------
        // Examine each cycle
        // --------------------------------

        for (const circularFlow of circularFlows) {

            // --------------------------------
            // Number of accounts
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
            // Number of transactions
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

        score += 10;

        reasons.push(
            `${rapidMoneyMovements.length} rapid money movements detected`
        );
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