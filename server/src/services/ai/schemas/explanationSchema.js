const explanationSchema = {
    type: "object",

    properties: {

        summary: {
            type: "string"
        },

        observedPatterns: {
            type: "array",

            items: {
                type: "object",

                properties: {

                    pattern: {
                        type: "string"
                    },

                    observedFacts: {
                        type: "array",

                        items: {
                            type: "string"
                        }
                    },

                    interpretation: {
                        type: "string"
                    },

                    evidenceTransactionIds: {
                        type: "array",

                        items: {
                            type: "string"
                        }
                    }
                },

                required: [
                    "pattern",
                    "observedFacts",
                    "interpretation",
                    "evidenceTransactionIds"
                ],

                additionalProperties: false
            }
        },

        transactionFlow: {
            type: "string"
        },

        investigationQuestions: {
            type: "array",

            items: {
                type: "string"
            }
        },

        limitations: {
            type: "array",

            items: {
                type: "string"
            }
        }
    },

    required: [
        "summary",
        "observedPatterns",
        "transactionFlow",
        "investigationQuestions",
        "limitations"
    ],

    additionalProperties: false
};

export default explanationSchema;