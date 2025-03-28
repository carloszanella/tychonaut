import {GraphManager} from './graphManager.js';
import {tokenNodes, poolEdges} from './data.js';
import {startUpdateLoop, stopUpdateLoop} from './loop.js';
import {find_best_route, callSimulationAPI} from "./solver.js";

// Global reference to graph manager
let graphManager;

// Initialize application
function initializeApp() {
    // Create a new instance of the graph manager
    graphManager = new GraphManager(tokenNodes, poolEdges);

    // Set up UI components
    graphManager.createNodeSelectionUI();
    graphManager.createProtocolSelectionUI();

    // Set up event listeners
    graphManager.setupEventListeners();

    // Select all nodes and protocols by default to show data
    graphManager.selectAllNodes();
    graphManager.selectAllProtocols();

    // Setup controls for the update loop and swap
    setupControls();

    // Start the update loop automatically
    const result = startUpdateLoop(graphManager);
    console.log("Application initialized");
}

// Setup controls for the application
function setupControls() {
    // Add event listener for the simulate button (now just for manually restarting the loop)
    const simulateButton = document.querySelector('.simulate-button');
    if (simulateButton) {
        console.log("Simulate button found, adding event listener");
        simulateButton.addEventListener('click', async () => {
            console.log('Execute Simulate button clicked');

            const sellTokenSelect = document.getElementById('sell-token').value;
            const buyTokenSelect = document.getElementById('buy-token').value;
            const sellAmount = document.getElementById('sell-amount').value;

            // First, reset any existing highlights
            graphManager.resetHighlights();

            const result = find_best_route(
                graphManager.getTokenNodes(),
                graphManager.getPoolEdges(),
                sellTokenSelect,
                buyTokenSelect
            );

            console.log("Best route result:", result);

            // Update UI with the results
            if (result.success) {
                // Extract node and edge IDs to highlight
                const nodeIds = [];
                const edgeIds = [];

                // Add start and end nodes
                if (result.route && result.route.length > 0) {
                    // Find nodes by label in the tokenNodes array
                    graphManager.getTokenNodes().forEach(node => {
                        if (result.route.includes(node.label)) {
                            nodeIds.push(node.id);
                        }
                    });
                }

                // Add edge IDs
                if (result.bestPath && result.bestPath.length > 0) {
                    result.bestPath.forEach(edge => {
                        edgeIds.push(edge.id);
                    });
                }
            
                graphManager.highlight(nodeIds, edgeIds);

                graphManager.setHighlightsPaused(true);

                // Call the simulation API
                //     struct SimulationResponse {
                //         success: bool,
                //             input_amount: String,
                //             output_amount: String,
                //             gas_estimate: BigUint,
                //     }
                const apiResult = await callSimulationAPI(
                    sellTokenSelect,
                    edgeIds,
                    sellAmount
                );

                if (apiResult && apiResult.success) {
                    // Calculate price
                    const price = parseFloat(apiResult.output_amount) / parseFloat(apiResult.input_amount);
                    const buyAmount = parseFloat(apiResult.output_amount);
                    const gasEstimate = parseFloat(apiResult.gas_estimate);

                    // Update the output boxes
                    // Get all highlight inputs in output rows
                    const outputElements = document.querySelectorAll('.output-row input.highlight');

                    // Find the price and gas elements by their parent label text
                    outputElements.forEach(element => {
                        const label = element.parentElement.querySelector('label');
                        if (label) {
                            if (label.textContent === 'Buy Amount') {
                                element.value = buyAmount.toFixed(6);
                            } else if (label.textContent === 'Price') {
                                element.value = price.toFixed(6);
                            } else if (label.textContent === 'Gas Usage') {
                                element.value = gasEstimate.toLocaleString();
                            }
                        }
                    });

                    // Set a suggested minimum buy amount (e.g., 99% of expected output)
                    const minBuyAmountInput = document.getElementById('min-buy-amount');
                    if (minBuyAmountInput) {
                        const suggestedMin = buyAmount * 0.99; // 1% slippage
                        minBuyAmountInput.value = suggestedMin.toFixed(6);
                    }
                } else {
                    // Handle API error or missing response
                    console.error("API call failed or returned unsuccessful result");

                    const outputElements = document.querySelectorAll('.output-row input.highlight');
                    outputElements.forEach(element => {
                        element.value = "N/A";
                    });

                    const minBuyAmountInput = document.getElementById('min-buy-amount');
                    if (minBuyAmountInput) {
                        minBuyAmountInput.value = "0";
                    }
                }

                console.log("Simulation API result:", apiResult);
            } else {
                console.error("Failed to find route:", result.reason);
            }
        });
    }

    // Add event listener for the swap button
    const swapButton = document.querySelector('.swap-button');
    if (swapButton) {
        console.log("Swap button found, adding event listener");
        swapButton.addEventListener('click', () => {
            console.log('Execute Swap button clicked');
            graphManager.setHighlightsPaused(false);
            // graphManager.resetHighlights();
            // In the future, this would execute the swap
        });
    } else {
        console.error("Swap button not found!");
    }
}

// Example of how to access graph data
function logCurrentGraphState() {
    console.log("Current pools:", graphManager.getPoolEdges());
    console.log("Selected nodes:", graphManager.getSelectedNodes());
    console.log("Selected protocols:", graphManager.getSelectedProtocols());
}

// Initialize everything when the page loads
window.addEventListener("load", () => {
    initializeApp();

    // Expose functions to the global scope for testing or external access
    window.graphManager = graphManager;
    window.startUpdateLoop = () => {
        return startUpdateLoop(graphManager);
    };
    window.stopUpdateLoop = () => {
        return stopUpdateLoop();
    };
    window.logCurrentGraphState = logCurrentGraphState;
});