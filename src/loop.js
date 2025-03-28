// Mock update functionality to test the network visualization

// Flag to control the update loop
let socket = null;
let isUpdating = false;
let processedFirstMessage = false;
// Reference to the graph manager (will be set when starting the loop)
let graphManagerRef = null;

// Start the update loop with a reference to the graph manager
export function startUpdateLoop(graphManager) {
    if (isUpdating) {
        console.log("Update loop is already running");
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
    console.log("Starting WebSocket connection...");

    try {
        // Create WebSocket connection
        socket = new WebSocket('ws://0.0.0.0:3000/ws');

        // Connection opened
        socket.addEventListener('open', (event) => {
            console.log('WebSocket connection established');
        });

        // Listen for messages
        socket.addEventListener('message', (event) => {
            console.log('Message from server:', event.data);

            // if (!processedFirstMessage) {
            //     // initialise graph
            //     // Try to parse the message as JSON
            //     processedFirstMessage = true;
            // }

            try {
                // Here you would process the received data
                // and update the graph based on message content
                const data = JSON.parse(event.data);
                processWebSocketMessage(data);
            } catch (parseError) {
                console.error('Error parsing WebSocket message:', parseError);
                console.log('Raw message:', event.data);
            }
        });

        // Connection error
        socket.addEventListener('error', (event) => {
            console.error('WebSocket error:', event);
            isUpdating = false;
        });

        // Connection closed
        socket.addEventListener('close', (event) => {
            console.log('WebSocket connection closed', event.code, event.reason);
            isUpdating = false;
        });

        return true;
    } catch (error) {
        console.error("Error starting WebSocket connection:", error);
        isUpdating = false;
        return false;
    }
}

// Process incoming WebSocket messages
function processWebSocketMessage(data) {
    // Log the entire message
    console.log('Processing WebSocket message');

    // Process the message with the graph manager
    if (graphManagerRef) {
        graphManagerRef.processWebSocketData(data);
    }
}

// Stop the update loop
export function stopUpdateLoop() {
    console.log("Stopping WebSocket connection");

    if (!isUpdating) {
        console.log("Update loop is not running");
        return false;
    }

    if (socket) {
        // Close the WebSocket connection properly
        socket.close(1000, "User requested disconnect");
        socket = null;
    }

    isUpdating = false;
    console.log("WebSocket connection closed");
    return true;
}