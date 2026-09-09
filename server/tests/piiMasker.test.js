import maskPII from "../src/services/ai/piiMasker.js";


describe("PII Masker", () => {

    test("masks sensitive personal information", () => {

        const evidence = {
            alerts: [
                {
                    pattern: {
                        type: "circular_flow"
                    },

                    evidence: {
                        accountIds: [
                            "ACC001"
                        ],

                        transactionIds: [
                            "TX001"
                        ],

                        transactions: [
                            {
                                id: "TX001",
                                from: "ACC001",
                                to: "ACC002",
                                amount: 50000,
                                currency: "INR",

                                name: "Rahul Sharma",
                                email: "rahul@example.com",
                                phone: "9876543210",
                                address: "Bangalore, Karnataka"
                            }
                        ]
                    }
                }
            ]
        };


        const result = maskPII(evidence);

        const transaction =
            result.alerts[0].evidence.transactions[0];


        expect(transaction.name)
            .toBe("[REDACTED]");

        expect(transaction.email)
            .toBe("[REDACTED]");

        expect(transaction.phone)
            .toBe("[REDACTED]");

        expect(transaction.address)
            .toBe("[REDACTED]");
    });


    test("preserves non-PII transaction information", () => {

        const evidence = {
            alerts: [
                {
                    evidence: {
                        transactions: [
                            {
                                id: "TX001",
                                from: "ACC001",
                                to: "ACC002",
                                amount: 50000,
                                currency: "INR",
                                timestamp:
                                    "2026-08-10T10:00:00Z"
                            }
                        ]
                    }
                }
            ]
        };


        const result = maskPII(evidence);

        const transaction =
            result.alerts[0].evidence.transactions[0];


        expect(transaction.id)
            .toBe("TX001");

        expect(transaction.from)
            .toBe("ACC001");

        expect(transaction.to)
            .toBe("ACC002");

        expect(transaction.amount)
            .toBe(50000);

        expect(transaction.currency)
            .toBe("INR");

        expect(transaction.timestamp)
            .toBe("2026-08-10T10:00:00Z");
    });


    test("does not modify the original evidence", () => {

        const evidence = {
            alerts: [
                {
                    evidence: {
                        transactions: [
                            {
                                id: "TX001",
                                name: "Rahul Sharma"
                            }
                        ]
                    }
                }
            ]
        };


        const result = maskPII(evidence);

        expect(
            evidence.alerts[0]
                .evidence.transactions[0]
                .name
        ).toBe("Rahul Sharma");


        expect(
            result.alerts[0]
                .evidence.transactions[0]
                .name
        ).toBe("[REDACTED]");
    });

});