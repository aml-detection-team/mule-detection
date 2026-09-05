import buildGraph from "./graph.js";
import detectCircularFlows from "./circularFlow.js";
import calculateRiskScore from "./riskScore.js";
import generateAccountRisk from "./accountRisk.js";

function analyzeTransactions(transactions) {
    const graph = buildGraph(transactions);

    const circularFlow = detectCircularFlows(graph);

    const riskResult = calculateRiskScore(circularFlow);

    const accountRisks = generateAccountRisk(
        circularFlow,
        riskResult
    );

    return {
        circularFlow,
        riskResult,
        accountRisks
    };
}

export default analyzeTransactions;