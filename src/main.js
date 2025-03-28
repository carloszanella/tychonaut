import {GraphManager} from './graphManager.js';
import {tokenNodes, poolEdges} from './data.js';
import {startUpdateLoop, stopUpdateLoop} from './loop.js';

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
            console.log('Simulate button clicked');
        });
    } else {
        console.error("Simulate button not found!");
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
    populateTokenDropdowns();
}

// Populate token dropdowns
function populateTokenDropdowns() {
    const sellTokenSelect = document.getElementById('sell-token');
    const buyTokenSelect = document.getElementById('buy-token');

    if (!sellTokenSelect || !buyTokenSelect) {
        console.error("Token select dropdowns not found");
        return;
    }

    // Clear existing options
    sellTokenSelect.innerHTML = '';
    buyTokenSelect.innerHTML = '';

    // Add options for each token
    tokenNodes.forEach(node => {
        const sellOption = document.createElement('option');
        sellOption.value = node.id;
        sellOption.textContent = node.label;

        const buyOption = document.createElement('option');
        buyOption.value = node.id;
        buyOption.textContent = node.label;

        sellTokenSelect.appendChild(sellOption);
        buyTokenSelect.appendChild(buyOption);
    });

    // Set default values
    if (sellTokenSelect.options.length > 0) {
        sellTokenSelect.selectedIndex = 1; // WETH is often index 1
    }

    if (buyTokenSelect.options.length > 0) {
        // Try to find LDO, or default to index 2
        const ldoIndex = Array.from(buyTokenSelect.options)
            .findIndex(option => option.textContent === 'LDO');
        buyTokenSelect.selectedIndex = ldoIndex !== -1 ? ldoIndex : 2;
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