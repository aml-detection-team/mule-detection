import analyzeTransactions from "../services/detection/analyzetransactions.js";

function detectTransactions(req, res) {
    const transactions = req.body;

    const result = analyzeTransactions(transactions);

    res.json(result);
}

export default detectTransactions;