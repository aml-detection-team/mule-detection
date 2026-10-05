import buildGraph from "./graph.js";
import detectCircularFlows from "./circularFlow.js";
import calculateRiskScore from "./riskScore.js";
import generateAccountRisk from "./accountRisk.js";
import detectRapidMoneyMovement from "./rapidMoneyMovement.js";

function analyzeTransactions(transactions) {
    // Step 1: Build transaction graph
    const graph = buildGraph(transactions);

    // Step 2: Detect circular money flows
    const circularFlow = detectCircularFlows(graph);

    // Step 3: Detect rapid money movement
    const rapidMoneyMovements =
        detectRapidMoneyMovement(transactions);

    // Step 4: Calculate overall risk
    const riskResult = calculateRiskScore(
        circularFlow,
        rapidMoneyMovements
    );

    // Step 5: Calculate risk for each account
    const accountRisks = generateAccountRisk(
        circularFlow,
        rapidMoneyMovements
    );

    return {
        circularFlow,
        rapidMoneyMovements,
        riskResult,
        accountRisks
    };
}

export default analyzeTransactions;