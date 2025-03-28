import {GraphManager} from './graphManager.js';
import {poolEdges, tokenNodes} from './data.js';
import {startUpdateLoop, stopUpdateLoop} from "./loop.js";

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

    // Setup controls for the update loop
    setupUpdateControls();
}

// Setup controls for the update loop
function setupUpdateControls() {
    // This would be expanded when the update loop is implemented
    // For now, it's just a placeholder
    console.log("Update controls are ready for integration");
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
    window.startUpdateLoop = startUpdateLoop;
    window.stopUpdateLoop = stopUpdateLoop;
    window.logCurrentGraphState = logCurrentGraphState;
});