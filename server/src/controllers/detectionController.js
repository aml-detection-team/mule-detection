import analyzeTransactions from "../services/detection/analyzetransactions.js";
import transactions from "../../../data/output/transactions.json" with { type: "json" };

function getDetectionResults(req, res) {
    try {
        const result = analyzeTransactions(transactions);

        res.status(200).json(result);
    } catch (error) {
        console.error("Detection error:", error);

        res.status(500).json({
            message: "Failed to analyze transactions",
            error: error.message
        });
    }
}

export default getDetectionResults;