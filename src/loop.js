// Mock update functionality to test the network visualization

// Flag to control the update loop
let isUpdating = false;
let updateInterval = null;

// Reference to the graph manager (will be set when starting the loop)
let graphManagerRef = null;

// Delay helper function - returns a promise that resolves after the specified time
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data for pool operations
const mockNewPool = {
    from: 1, // USDC
    to: 2,   // WETH
    value: 8,
    width: 2,
    protocol: "uniswap_v3"
};

const mockUpdatePool = {
    id: "0x1246",
    from: 4, // DAI
    to: 5,   // USDT
    value: 10, // Increased value
    width: 2,
    protocol: "uniswap_v3"
};

const mockRemovePool = {
    id: "0x1236",
    from: 2, // WETH
    to: 10,  // LDO
    protocol: "uniswap_v3"
};

// For testing, use shorter delays
const DELAY_MS = 5000; // 5 seconds for testing

// Async function to run the demo update sequence
async function runMockUpdateSequence() {
    try {
        // Check if graph manager is available
        if (!graphManagerRef) {
            console.error("Graph manager not available");
            return;
        }

        // Step 1: Wait, then add a new pool
        await delay(DELAY_MS);

        if (!isUpdating) return; // Stop if updates were canceled

        console.log("Adding new pool: USDC <-> WETH");
        graphManagerRef.addPoolEdges([mockNewPool]);

        // Step 2: Wait, then update a pool
        await delay(DELAY_MS);

        if (!isUpdating) return; // Stop if updates were canceled

        console.log("Updating pool: DAI <-> USDT (increasing value)");
        graphManagerRef.updatePoolValues([mockUpdatePool]);

        // Step 3: Wait, then remove a pool
        await delay(DELAY_MS);

        if (!isUpdating) return; // Stop if updates were canceled

        console.log("Removing pool: WETH <-> LDO");
        graphManagerRef.removePoolEdges([mockRemovePool]);

    } catch (error) {
        console.error("Error in mock update sequence:", error);
    } finally {
        isUpdating = false;
    }
}

// Start the update loop with a reference to the graph manager
export function startUpdateLoop(graphManager) {
    if (isUpdating) {
        return false;
    }

    // Store reference to graph manager
    graphManagerRef = graphManager;

    if (!graphManagerRef) {
        console.error("GraphManager is null or undefined!");
        return false;
    }

    // Set the flag
    isUpdating = true;

    // Run the async update sequence
    runMockUpdateSequence().catch(err => {
        console.error("Error in update sequence:", err);
        isUpdating = false;
    });

    return true;
}

// Stop the update loop
export function stopUpdateLoop() {
    if (!isUpdating) {
        return false;
    }

    isUpdating = false;

    // If there's a timeout or interval, we would clear it here
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }

    return true;
}