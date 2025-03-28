import {GraphManager} from './graphManager.js';
import {tokenNodes, poolEdges} from './data.js';

// Global reference to graph manager
let graphManager;

// Flag to control the update loop
let isUpdating = false;

// Initialize application
function initializeApp() {
    // Create a new instance of the graph manager
    graphManager = new GraphManager(tokenNodes, poolEdges);

    // Set up UI components
    graphManager.createNodeSelectionUI();

    // Set up event listeners
    graphManager.setupEventListeners();

    // Setup controls for the update loop
    setupUpdateControls();
}

// Setup controls for the update loop
function setupUpdateControls() {
    // This would be expanded when the update loop is implemented
    // For now, it's just a placeholder
    console.log("Update controls are ready for integration");
}

// Placeholder for the update loop that will be implemented by another developer
function startUpdateLoop() {
    if (isUpdating) {
        console.log("Update loop is already running");
        return;
    }

    isUpdating = true;
    console.log("Update loop started");

    // This is where the actual update loop would be implemented
    // For example:
    /*
    updateInterval = setInterval(() => {
      // Get new data from somewhere
      const newNodeData = fetchNewNodeData();
      const newEdgeData = fetchNewEdgeData();

      // Update the graph
      graphManager.updateNodeData(newNodeData);
      graphManager.updateEdgeData(newEdgeData);
    }, 1000);
    */
}

// Stop the update loop
function stopUpdateLoop() {
    isUpdating = false;
    console.log("Update loop stopped");

    // If an interval was set, it would be cleared here
    // clearInterval(updateInterval);
}

// Example of how to access graph data
function logCurrentGraphState() {
    console.log("Current nodes:", graphManager.getNodeData());
    console.log("Current edges:", graphManager.getEdgeData());
    console.log("Selected nodes:", graphManager.getSelectedNodes());
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