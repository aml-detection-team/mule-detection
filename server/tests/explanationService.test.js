import generateExplanation
    from "../src/services/ai/explanationService.js";


describe("AI Explanation Service", () => {

    test("generates a valid explanation from detection evidence", async () => {

        const detectionResult = {

            alerts: [

                {
                    pattern: {
                        type: "circular_flow"
                    },

                    risk: {
                        score: 82,
                        level: "HIGH",
                        reasons: [
                            "Circular transaction pattern detected"
                        ]
                    },

                    evidence: {

                        accountIds: [
                            "ACC081",
                            "ACC100",
                            "ACC088"
                        ],

                        transactionIds: [
                            "TX0403",
                            "TX0474",
                            "TX1044"
                        ],

                        transactions: [

                            {
                                id: "TX0403",
                                from: "ACC081",
                                to: "ACC100",
                                amount: 45000,
                                currency: "INR",
                                timestamp:
                                    "2026-08-10T10:00:00Z"
                            },

                            {
                                id: "TX0474",
                                from: "ACC100",
                                to: "ACC088",
                                amount: 45000,
                                currency: "INR",
                                timestamp:
                                    "2026-08-10T10:30:00Z"
                            },

                            {
                                id: "TX1044",
                                from: "ACC088",
                                to: "ACC081",
                                amount: 45000,
                                currency: "INR",
                                timestamp:
                                    "2026-08-10T11:00:00Z"
                            }
                        ]
                    }
                }
            ]
        };


        const result =
            await generateExplanation(
                detectionResult
            );


        expect(result).toHaveProperty(
            "explanation"
        );

        expect(result).toHaveProperty(
            "evidence"
        );

        expect(result).toHaveProperty(
            "prompt"
        );


        expect(result.explanation).toHaveProperty(
            "summary"
        );

        expect(result.explanation).toHaveProperty(
            "observedPatterns"
        );

        expect(
            result.explanation.observedPatterns[0]
                .pattern
        ).toBe("circular_flow");


        expect(
            result.explanation.observedPatterns[0]
                .evidenceTransactionIds
        ).toEqual([
            "TX0403",
            "TX0474",
            "TX1044"
        ]);
    });
});