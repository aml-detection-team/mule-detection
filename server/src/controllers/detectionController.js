import analyzeTransactions from "../services/detection/analyzetransactions.js";
import adaptDetectionResults from "../services/detection/detectionAdapter.js";
import transactions from "../../../data/output/transactions.json" with { type: "json" };

function getDetectionResults(req, res) {
    try {

        console.log("Running transaction analysis...");

        /*
         * Run detection engine
         */
        const result = analyzeTransactions(transactions);

        /*
         * Pass BOTH detection result and
         * original transactions to adapter.
         */
        const adaptedResult =
            adaptDetectionResults(
                result,
                transactions
            );

        /*
         * Send standardized alerts
         */
        res.status(200).json(adaptedResult);

    } catch (error) {

        console.error(
            "Detection error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to analyze transactions",

            error:
                error.message
        });
    }
}

export default getDetectionResults;