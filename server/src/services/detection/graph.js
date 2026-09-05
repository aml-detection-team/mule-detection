function buildGraph(transactions) {
    const graph = {};

    for (const transaction of transactions) {
        const from = transaction.fromAccount;

        if (!graph[from]) {
            graph[from] = [];
        }

        graph[from].push(transaction);
    }

    return graph;
}

export default buildGraph;