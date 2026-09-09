import OpenAI from "openai";
import explanationSchema from "./schemas/explanationSchema.js";
import aiConfig from "./aiConfig.js";

function buildTransactionFacts(transactions) {

    return transactions.map(transaction => {

        const parts = [];

        if (transaction.id) {
            parts.push(transaction.id);
        }

        if (
            transaction.from &&
            transaction.to
        ) {
            parts.push(
                `moved funds from ${transaction.from} to ${transaction.to}`
            );
        }

        if (
            transaction.amount !== undefined &&
            transaction.currency
        ) {
            parts.push(
                `for ${transaction.amount} ${transaction.currency}`
            );
        }

        if (transaction.timestamp) {
            parts.push(
                `at ${transaction.timestamp}`
            );
        }

        return parts.join(" ");
    });
}

async function generateAIResponse(prompt, evidence) {

    // =========================================
    // MOCK PROVIDER
    // =========================================

    if (aiConfig.provider === "mock") {

        const firstAlert = evidence.alerts[0];

        const patternType =
            firstAlert?.pattern?.type || "unknown";

        const transactionIds =
            firstAlert?.evidence?.transactionIds || [];

        const accountIds =
            firstAlert?.evidence?.accountIds || [];

        const transactions =
            firstAlert?.evidence?.transactions || [];

        let summary;
        let patternExplanation;
        let observedFacts = [];


        // =========================================
        // DETECTED PATTERN
        // =========================================

        switch (patternType) {

            case "circular_flow":

                summary =
                    "The transaction activity shows a circular flow of funds across multiple accounts.";

                patternExplanation =
                    "The transaction sequence forms a closed flow in which funds move through multiple accounts and return to the originating account.";

                // Build facts directly from evidence
                for (const transaction of transactions) {

                    observedFacts.push(
                        `${transaction.id} transferred ${transaction.amount} ${transaction.currency} from ${transaction.from} to ${transaction.to} at ${transaction.timestamp}.`
                    );
                }

                break;


            case "fan_in":

                summary =
                    "The transaction activity shows funds converging into a common account from multiple sources.";

                patternExplanation =
                    "Multiple accounts transferred funds into a common receiving account, creating a fan-in transaction pattern.";

                observedFacts.push(
                    `The detection system identified a fan_in pattern involving ${transactionIds.length} transaction(s).`
                );

                break;


            case "fan_out":

                summary =
                    "The transaction activity shows funds being distributed from one account to multiple accounts.";

                patternExplanation =
                    "Funds were transferred from a common originating account to multiple receiving accounts, creating a fan-out pattern.";

                observedFacts.push(
                    `The detection system identified a fan_out pattern involving ${transactionIds.length} transaction(s).`
                );

                break;


            case "structuring":

                summary =
                    "The transaction activity contains multiple relatively small transactions that may warrant investigation for possible structuring.";

                patternExplanation =
                    "Multiple transactions involving the same account appear to divide transaction activity into smaller amounts.";

                observedFacts.push(
                    `The detection system identified a structuring pattern involving ${transactionIds.length} transaction(s).`
                );

                break;


            case "rapid_money_movement":

                summary =
                    "The transaction activity shows rapid movement of funds through an account.";

                patternExplanation =
                    "Funds were received and subsequently transferred out within a short period, which may warrant further investigation.";

                observedFacts.push(
                    `The detection system identified a rapid money movement pattern involving ${transactionIds.length} transaction(s).`
                );

                break;


            default:

                summary =
                    "The transaction activity contains a pattern identified by the detection system that warrants further investigation.";

                patternExplanation =
                    "The available evidence indicates transaction activity that was flagged by the detection system.";

                observedFacts.push(
                    `The detection system identified a ${patternType} pattern.`
                );

                break;
        }


        // =========================================
        // MOCK RESPONSE
        // =========================================

        return {

            summary,

            observedPatterns: [
                {
                    pattern: patternType,

                    observedFacts,

                    interpretation:
                        patternExplanation,

                    evidenceTransactionIds:
                        transactionIds
                }
            ],

            transactionFlow:
                accountIds.length > 0
                    ? accountIds.join(" → ") +
                      " → " +
                      accountIds[0]
                    : "Insufficient evidence to determine transaction flow.",

            investigationQuestions: [
                "What is the business purpose of these transactions?",
                "What is the relationship between the involved accounts?",
                "Are there legitimate commercial or financial reasons for this transaction pattern?"
            ],

            limitations: [
                "The available transaction evidence does not establish the underlying purpose of the transfers.",
                "The detected pattern alone does not establish illegal activity."
            ]
        };
    }


    // =========================================
    // OPENAI PROVIDER
    // =========================================

    if (aiConfig.provider === "openai") {

        if (!aiConfig.apiKey) {

            throw new Error(
                "OPENAI_API_KEY is not configured"
            );
        }


        const client =
            new OpenAI({
                apiKey: aiConfig.apiKey
            });


        const response =
            await client.responses.create({

                model: aiConfig.model,

                input: [
                    {
                        role: "system",
                        content: prompt.systemPrompt
                    },

                    {
                        role: "user",
                        content: prompt.userPrompt
                    }
                ],

                text: {
                    format: {
                        type: "json_schema",

                        name:
                            "aml_investigation_explanation",

                        strict: true,

                        schema:
                            explanationSchema
                    }
                }
            });


        const output =
            response.output_text;


        if (!output) {

            throw new Error(
                "OpenAI returned an empty response"
            );
        }


        try {

            return JSON.parse(output);

        } catch (error) {

            throw new Error(
                "OpenAI returned invalid JSON"
            );
        }
    }


    // =========================================
    // UNSUPPORTED PROVIDER
    // =========================================

    throw new Error(
        `Unsupported AI provider: ${aiConfig.provider}`
    );
}


export default generateAIResponse;