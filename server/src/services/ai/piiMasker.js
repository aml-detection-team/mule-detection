function maskPII(evidence) {
    if (!evidence || !Array.isArray(evidence.alerts)) {
        throw new Error("Invalid evidence: alerts[] is required");
    }

    const maskedAlerts = evidence.alerts.map((alert) => {
        const transactions = alert.evidence.transactions.map((transaction) => {
            const maskedTransaction = { ...transaction };

            // Mask common PII fields if they exist
            if (maskedTransaction.name) {
                maskedTransaction.name = "[REDACTED]";
            }

            if (maskedTransaction.email) {
                maskedTransaction.email = "[REDACTED]";
            }

            if (maskedTransaction.phone) {
                maskedTransaction.phone = "[REDACTED]";
            }

            if (maskedTransaction.address) {
                maskedTransaction.address = "[REDACTED]";
            }

            return maskedTransaction;
        });

        return {
            ...alert,

            evidence: {
                ...alert.evidence,
                transactions
            }
        };
    });

    return {
        alerts: maskedAlerts
    };
}

export default maskPII;