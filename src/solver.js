/**
 * Finds the best route between a start token and an end token
 * by finding all depth=2 paths and selecting the one with the highest
 * multiplication of spot prices.
 *
 * @param {Array} nodes - Array of token nodes
 * @param {Array} edges - Array of pool edges
 * @param {string|number} startNodeId - ID of the starting token
 * @param {string|number} endNodeId - ID of the ending token
 * @returns {Object} - Result containing the best path and its spot price product
 */
export function find_best_route(nodes, edges, startNodeId, endNodeId) {
    // Ensure nodes and edges are valid
    if (!nodes || !edges || !startNodeId || !endNodeId) {
        console.error("Missing required parameters");
        return {success: false, reason: "Missing parameters"};
    }

    // Check if start and end nodes exist
    const startNode = nodes.find(node => node.id == startNodeId);
    const endNode = nodes.find(node => node.id == endNodeId);

    if (!startNode) {
        console.error(`Start node with ID ${startNodeId} not found`);
        return {success: false, reason: "Start node not found"};
    }

    if (!endNode) {
        console.error(`End node with ID ${endNodeId} not found`);
        return {success: false, reason: "End node not found"};
    }

    // Find direct path first (depth 1)
    const directEdges = edges.filter(edge =>
        (edge.from == startNodeId && edge.to == endNodeId) ||
        (edge.from == endNodeId && edge.to == startNodeId)
    );

    const directPaths = directEdges.map(edge => {
        const isForward = edge.from == startNodeId;
        return {
            path: [edge],
            spot_price: isForward ? edge.spot_price : 1 / edge.spot_price,
            hops: 1
        };
    });

    // Find all intermediary nodes
    let intermediaryNodes = new Set();
    edges.forEach(edge => {
        if (edge.from == startNodeId) {
            intermediaryNodes.add(edge.to);
        } else if (edge.to == startNodeId) {
            intermediaryNodes.add(edge.from);
        }
    });

    // Remove the end node from intermediary nodes if it's directly connected
    intermediaryNodes.delete(endNodeId);

    // Collect all depth=2 paths
    const depthTwoPaths = [];

    // For each intermediary node, find paths to end node
    intermediaryNodes.forEach(intermediaryId => {
        // Find edge from start to intermediary
        const firstHopEdges = edges.filter(edge =>
            (edge.from == startNodeId && edge.to == intermediaryId) ||
            (edge.from == intermediaryId && edge.to == startNodeId)
        );

        // Find edge from intermediary to end
        const secondHopEdges = edges.filter(edge =>
            (edge.from == intermediaryId && edge.to == endNodeId) ||
            (edge.from == endNodeId && edge.to == intermediaryId)
        );

        // Create all possible paths through this intermediary
        firstHopEdges.forEach(firstEdge => {
            secondHopEdges.forEach(secondEdge => {
                const firstIsForward = firstEdge.from == startNodeId;
                const secondIsForward = secondEdge.from == intermediaryId;

                const firstPrice = firstIsForward ? firstEdge.spot_price : 1 / firstEdge.spot_price;
                const secondPrice = secondIsForward ? secondEdge.spot_price : 1 / secondEdge.spot_price;

                depthTwoPaths.push({
                    path: [firstEdge, secondEdge],
                    spot_price: firstPrice * secondPrice,
                    hops: 2,
                    intermediary: intermediaryId
                });
            });
        });
    });

    // Combine direct and depth=2 paths
    const allPaths = [...directPaths, ...depthTwoPaths];

    // No paths found
    if (allPaths.length === 0) {
        return {
            success: false,
            reason: "No path found between tokens",
            startNode: startNode.label,
            endNode: endNode.label
        };
    }

    // Find the path with the highest spot price product
    const bestPath = allPaths.reduce((best, current) =>
            current.spot_price > best.spot_price ? current : best
        , allPaths[0]);

    // Find node labels for better display
    const getNodeLabel = id => {
        const node = nodes.find(n => n.id == id);
        return node ? node.label : `Unknown(${id})`;
    };

    // Build result object
    const result = {
        success: true,
        startToken: getNodeLabel(startNodeId),
        endToken: getNodeLabel(endNodeId),
        bestPath: bestPath.path,
        spotPriceProduct: bestPath.spot_price,
        hops: bestPath.hops,
        route: []
    };

    // Build human-readable route
    if (bestPath.hops === 1) {
        const edge = bestPath.path[0];
        result.route = [
            getNodeLabel(startNodeId),
            getNodeLabel(endNodeId)
        ];
    } else {
        const intermediaryId = bestPath.intermediary;
        result.route = [
            getNodeLabel(startNodeId),
            getNodeLabel(intermediaryId),
            getNodeLabel(endNodeId)
        ];
    }

    return result;
}

// Function to call the simulation API
export async function callSimulationAPI(sellToken, pools, amount) {
    try {
        const response = await fetch('http://0.0.0.0:3000/api/simulate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sell_token: sellToken,
                pools: pools,
                amount: amount
            })
        });

        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Simulation API response:", data);
        return data;
    } catch (error) {
        console.error("Error calling simulation API:", error);
        return null;
    }
}