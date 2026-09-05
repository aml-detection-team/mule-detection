function generateAccountRisk(circularFlow, riskResult) {
    if (!circularFlow) {
        return [];
    }

    const accountRisks = [];

    for (const accountId of circularFlow.accountIds) {
        accountRisks.push({
            accountId,
            riskScore: riskResult.score,
            riskLevel: riskResult.riskLevel,
            reasons: riskResult.reasons
        });
    }

    return accountRisks;
}

export default generateAccountRisk;