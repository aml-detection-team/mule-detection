function buildEvidence(detectionResult) {
    if (!detectionResult || !Array.isArray(detectionResult.alerts)) {
        throw new Error("Invalid detection result: alerts[] is required");
    }

    const alerts = detectionResult.alerts.map((alert) => {
        return {
            pattern: {
                type: alert.pattern?.type
            },

            risk: {
                score: alert.risk?.score,
                level: alert.risk?.level,
                reasons: alert.risk?.reasons || []
            },

            evidence: {
                accountIds: alert.evidence?.accountIds || [],
                transactionIds: alert.evidence?.transactionIds || [],
                transactions: alert.evidence?.transactions || []
            }
        };
    });

    return {
        alerts
    };
}

export default buildEvidence;