import {GraphManager} from './graphManager.js';
import {tokenNodes, poolEdges} from './data.js';
import {startUpdateLoop, stopUpdateLoop} from './loop.js';
import {find_best_route} from "./solver.js";

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
        simulateButton.addEventListener('click', () => {
            console.log('Execute Simulate button clicked');

            const sellTokenSelect = document.getElementById('sell-token').value;
            const buyTokenSelect = document.getElementById('buy-token').value;

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