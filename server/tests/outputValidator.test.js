import validateExplanation
    from "../src/services/ai/outputValidator.js";


const validEvidence = {
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
                        timestamp: "2026-08-10T10:00:00Z"
                    },

                    {
                        id: "TX0474",
                        from: "ACC100",
                        to: "ACC088",
                        amount: 45000,
                        currency: "INR",
                        timestamp: "2026-08-10T10:30:00Z"
                    },

                    {
                        id: "TX1044",
                        from: "ACC088",
                        to: "ACC081",
                        amount: 45000,
                        currency: "INR",
                        timestamp: "2026-08-10T11:00:00Z"
                    }
                ]
            }
        }
    ]
};


const validExplanation = {
    summary:
        "The transaction activity shows a circular flow of funds.",

    observedPatterns: [
        {
            pattern: "circular_flow",

            observedFacts: [
    "TX0403 transferred funds from ACC081 to ACC100.",
    "TX0474 transferred funds from ACC100 to ACC088.",
    "TX1044 transferred funds from ACC088 to ACC081."
],

interpretation:
    "The transactions form a circular flow of funds that may warrant further investigation.",
            evidenceTransactionIds: [
                "TX0403",
                "TX0474",
                "TX1044"
            ]
        }
    ],

    transactionFlow:
        "ACC081 → ACC100 → ACC088 → ACC081",

    investigationQuestions: [
        "What is the business purpose of these transactions?"
    ],

    limitations: [
        "The evidence does not establish the underlying purpose."
    ]
};


// ============================================
// TEST 1 — VALID RESPONSE
// ============================================

test("accepts a valid AI explanation", () => {

    const result =
        validateExplanation(
            validExplanation,
            validEvidence
        );

    console.log("VALIDATION RESULT:", result);

expect(result.valid).toBe(true);
expect(result.errors).toHaveLength(0);
});


// ============================================
// TEST 2 — HALLUCINATED TRANSACTION ID
// ============================================

test("rejects hallucinated transaction ID", () => {

    const invalidExplanation = {
        ...validExplanation,

        observedPatterns: [
            {
                ...validExplanation.observedPatterns[0],

                evidenceTransactionIds: [
                    "TX9999"
                ]
            }
        ]
    };

    const result =
        validateExplanation(
            invalidExplanation,
            validEvidence
        );

    expect(result.valid).toBe(false);

    expect(result.errors).toContain(
        'Invalid transaction ID "TX9999" in observedPatterns[0]'
    );
});


// ============================================
// TEST 3 — MISSING SUMMARY
// ============================================

test("rejects explanation with missing summary", () => {

    const invalidExplanation = {
        ...validExplanation
    };

    delete invalidExplanation.summary;

    const result =
        validateExplanation(
            invalidExplanation,
            validEvidence
        );

    expect(result.valid).toBe(false);
});


// ============================================
// TEST 4 — INVALID STRUCTURE
// ============================================

test("rejects invalid explanation structure", () => {

    const invalidExplanation = {
        summary: 123,

        observedPatterns: "not an array",

        transactionFlow: null,

        investigationQuestions: {},

        limitations: "invalid"
    };

    const result =
        validateExplanation(
            invalidExplanation,
            validEvidence
        );

    expect(result.valid).toBe(false);
});