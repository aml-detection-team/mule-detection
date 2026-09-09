import fs from "fs";

import analyzeTransactions
    from "../services/detection/analyzetransactions.js";

import adaptBOutput
    from "../services/ai/bToAIAdapter.js";

import generateExplanation
    from "../services/ai/explanationService.js";


async function generateAIExplanation(req, res) {

    try {

        const { transactionIds } = req.body;


        // Validate request
        if (!Array.isArray(transactionIds)) {

            return res.status(400).json({
                success: false,
                message: "transactionIds must be an array"
            });

        }


        if (transactionIds.length === 0) {

            return res.status(400).json({
                success: false,
                message: "At least one transaction ID is required"
            });

        }


        const transactions = JSON.parse(
            fs.readFileSync(
                "../data/output/transactions.json",
                "utf-8"
            )
        );


        // Find requested transactions
        const selectedTransactions =
            transactions.filter(
                transaction =>
                    transactionIds.includes(
                        transaction.transactionId
                    )
            );


        // Make sure all requested IDs exist
        const foundIds = new Set(
            selectedTransactions.map(
                transaction =>
                    transaction.transactionId
            )
        );


        const missingIds =
            transactionIds.filter(
                id => !foundIds.has(id)
            );


        if (missingIds.length > 0) {

            return res.status(400).json({
                success: false,
                message: "Some transaction IDs were not found",
                missingTransactionIds: missingIds
            });

        }


        // PERSON B
        const bResult =
            analyzeTransactions(
                selectedTransactions
            );


        // B → C
        const aiInput =
            adaptBOutput(bResult);


        // PERSON C
        const result =
            await generateExplanation(
                aiInput
            );


        res.json({
            success: true,
            explanation: result.explanation
        });

    }

    catch (error) {

        console.error(
            "AI explanation error:",
            error
        );


        res.status(500).json({
            success: false,
            message: "Failed to generate explanation"
        });

    }
}


export default generateAIExplanation;