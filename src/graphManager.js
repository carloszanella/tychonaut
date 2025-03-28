import {Network} from "vis-network";
import {DataSet} from "vis-data";
import {protocolColorMap, protocols} from './data.js';

let firstMessage = true;

// Graph Manager class to handle all network visualization operations
export class GraphManager {
// Updated constructor without initialization
    constructor(tokenNodes = [], poolEdges = []) {
        // Network components
        this.nodes = null;
        this.edges = null;
        this.network = null;
        this.selectedNodes = new Set(); // Track selected nodes
        this.selectedProtocols = new Set(); // Track selected protocols

        // Empty data containers to start with
        this.tokenNodes = [];
        this.poolEdges = [];

        // Initialize just the network container
        this.initializeNetwork();
    }

    // Initialize the network with empty data
    initializeNetwork() {
        // Create empty datasets
        this.nodes = new DataSet([]);
        this.edges = new DataSet([]);

        const container = document.getElementById("mynetwork");
        const data = {
            nodes: this.nodes,
            edges: this.edges,
        };

        const options = {
            // autoResize: false,
            nodes: {
                shape: "circle",
                color: {
                    border: "#ffffff",
                    background: "#232323",
                    highlight: {
                        border: "#000000",
                        background: "#F66733",
                    }
                },
                borderWidthSelected: 3,
                font: {
                    size: 10,
                    color: "#ffffff",
                    face: "monospace",
                },
            },
            physics: {
                // solver: "repulsion",
                // repulsion: {
                //     nodeDistance: 70,
                // }
                barnesHut: {
                    springLength: 800,
                    gravitationalConstant: -2000,
                }
            }
        };

        // Create the network
        this.network = new Network(container, data, options);
    }

    // Create checkboxes for node selection
    createNodeSelectionUI() {
        const nodeSelectionContainer = document.getElementById("node-selection");

        if (!nodeSelectionContainer) {
            console.error("Node selection container not found");
            return;
        }

        // Clear any existing content
        nodeSelectionContainer.innerHTML = "";

        // Create a checkbox for each token node
        this.tokenNodes.forEach((node) => {
            const checkboxItem = document.createElement("div");
            checkboxItem.className = "checkbox-item";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `node-${node.id}`;
            checkbox.dataset.nodeId = node.id.toString();

            const label = document.createElement("label");
            label.htmlFor = `node-${node.id}`;
            label.textContent = node.label;

            checkboxItem.appendChild(checkbox);
            checkboxItem.appendChild(label);
            nodeSelectionContainer.appendChild(checkboxItem);

            // Add event listener to each checkbox
            checkbox.addEventListener("change", () => {
                this.toggleNode(node.id, checkbox.checked);
            });
        });
    }

    // Create checkboxes for protocol selection
    createProtocolSelectionUI() {
        const protocolSelectionContainer = document.getElementById("protocol-selection");

        if (!protocolSelectionContainer) {
            console.error("Protocol selection container not found");
            return;
        }

        // Clear any existing content
        protocolSelectionContainer.innerHTML = "";

        // Create a checkbox for each protocol
        protocols.forEach((protocol) => {
            const checkboxItem = document.createElement("div");
            checkboxItem.className = "checkbox-item";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `protocol-${protocol}`;
            checkbox.dataset.protocol = protocol;

            const label = document.createElement("label");
            label.htmlFor = `protocol-${protocol}`;
            label.textContent = protocol.replace('_', ' ').toUpperCase();

            // Add color indicator
            if (protocolColorMap[protocol]) {
                const colorIndicator = document.createElement("span");
                colorIndicator.className = "color-indicator";
                colorIndicator.style.backgroundColor = protocolColorMap[protocol].color;
                checkboxItem.appendChild(colorIndicator);
            }

            checkboxItem.appendChild(checkbox);
            checkboxItem.appendChild(label);
            protocolSelectionContainer.appendChild(checkboxItem);

            // Add event listener to each checkbox
            checkbox.addEventListener("change", () => {
                this.toggleProtocol(protocol, checkbox.checked);
            });
        });
    }

    populateTokenDropdowns() {
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
        this.tokenNodes.forEach(node => {
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

    // Toggle the visibility of a node
    toggleNode(nodeId, isVisible) {
        if (isVisible) {
            this.selectedNodes.add(nodeId);
        } else {
            this.selectedNodes.delete(nodeId);
        }

        // Flag that node selection has changed
        this._nodeSelectionChanged = true;

        // Update the network to reflect changes
        this.updateNetwork();
    }

    // Toggle the visibility of a protocol
    toggleProtocol(protocol, isVisible) {
        if (isVisible) {
            this.selectedProtocols.add(protocol);
        } else {
            this.selectedProtocols.delete(protocol);
        }

        // No need to change structure, just update appearance
        this.updateNetwork();
    }

    // Update the network (main method that decides whether to update structure or just appearance)
    updateNetwork() {
        // If there are no edges displayed yet or node selection changed,
        // we need to update the whole structure
        if (this.edges.length === 0 || this._nodeSelectionChanged) {
            this.updateNetworkStructure();
            this._nodeSelectionChanged = false;
        } else {
            // Otherwise, just update the appearance of existing edges
            this.updateEdgeAppearance();
        }
    }

    // Select all nodes
    selectAllNodes() {
        this.tokenNodes.forEach(node => {
            this.selectedNodes.add(node.id);
            this.setCheckboxState(`node-${node.id}`, true);
        });
        this.updateNetwork();
    }

    // Deselect all nodes
    deselectAllNodes() {
        this.selectedNodes.clear();
        this.tokenNodes.forEach(node => {
            this.setCheckboxState(`node-${node.id}`, false);
        });
        this.updateNetwork();
    }

    // Select all protocols
    selectAllProtocols() {
        protocols.forEach(protocol => {
            this.selectedProtocols.add(protocol);
            this.setCheckboxState(`protocol-${protocol}`, true);
        });
        this.updateNetwork();
    }

    // Deselect all protocols
    deselectAllProtocols() {
        this.selectedProtocols.clear();
        protocols.forEach(protocol => {
            this.setCheckboxState(`protocol-${protocol}`, false);
        });
        this.updateNetwork();
    }

    // Reset the network (clear all nodes but keep protocol selection)
    resetNetwork() {
        // Deselect all nodes
        this.deselectAllNodes();

        // Set flag to ensure the network structure is updated
        this._nodeSelectionChanged = true;

        // Force clear the visualization by clearing nodes and edges directly
        this.nodes.clear();
        this.edges.clear();
    }

    // Set the state of a checkbox by ID
    setCheckboxState(elementId, checked) {
        const checkbox = document.getElementById(elementId);
        if (checkbox) {
            checkbox.checked = checked;
        }
    }

    // Setup event listeners for control buttons
    setupEventListeners() {
        document.getElementById("select-all").addEventListener("click", () => {
            this.selectAllNodes();
        });

        document.getElementById("reset").addEventListener("click", () => {
            this.resetNetwork();
        });
    }

    // Public methods for external update

    // Get currently selected node IDs
    getSelectedNodes() {
        return [...this.selectedNodes];
    }

    // Get currently selected protocols
    getSelectedProtocols() {
        return [...this.selectedProtocols];
    }

    // Add new pool edges
    addPoolEdges(newEdges) {
        // Set color based on protocol
        newEdges.forEach(edge => {
            if (edge.protocol && protocolColorMap[edge.protocol]) {
                edge.color = protocolColorMap[edge.protocol].color;
            }

            this.styleEdgeByProtocol(edge);
        });

        // Add the new edges to the stored data
        this.poolEdges = [...this.poolEdges, ...newEdges];

        // Add edges to the visualization if they connect selected nodes and match selected protocols
        const edgesToAdd = newEdges.filter(edge =>
            this.selectedNodes.has(edge.from) &&
            this.selectedNodes.has(edge.to)
        );

        if (edgesToAdd.length > 0) {
            console.log("Adding edges to visualization:", edgesToAdd);
            this.edges.add(edgesToAdd);
        }
    }

    // Update existing pool values
    updatePoolValues(updatedEdges) {
        // Keep track of edges that need to be updated in the visualization
        const visualUpdates = [];

        // Update values for existing edges
        updatedEdges.forEach(updatedEdge => {
            const index = this.poolEdges.findIndex(
                edge => edge.from === updatedEdge.from &&
                    edge.to === updatedEdge.to &&
                    edge.protocol === updatedEdge.protocol
            );

            if (index !== -1) {
                // Update the edge value and width
                this.poolEdges[index].value = updatedEdge.value;
                this.poolEdges[index].width = updatedEdge.width || this.poolEdges[index].width;

                // Update color if protocol changed
                if (updatedEdge.protocol &&
                    this.poolEdges[index].protocol !== updatedEdge.protocol &&
                    protocolColorMap[updatedEdge.protocol]) {
                    this.poolEdges[index].protocol = updatedEdge.protocol;
                    this.poolEdges[index].color = protocolColorMap[updatedEdge.protocol].color;
                }

                // Apply styling based on protocol selection
                const styledEdge = this.styleEdgeByProtocol({...this.poolEdges[index]});

                // Add to visual updates if the nodes are selected
                if (this.selectedNodes.has(styledEdge.from) &&
                    this.selectedNodes.has(styledEdge.to)) {
                    visualUpdates.push(styledEdge);
                }
            }
        });

        // Update the visualization directly
        if (visualUpdates.length > 0) {
            console.log("Updating edges in visualization:", visualUpdates);
            this.edges.update(visualUpdates);
        }
    }

    // Remove pool edges
    removePoolEdges(edgesToRemove) {
        const edgeIds = [];

        // edgesToRemove is an array of objects with from, to, and protocol properties
        edgesToRemove.forEach(edgeToRemove => {
            const edgeId = edgeToRemove.id;
            edgeIds.push(edgeId);

            this.poolEdges = this.poolEdges.filter(
                edge => !(edge.from === edgeToRemove.from &&
                    edge.to === edgeToRemove.to &&
                    edge.protocol === edgeToRemove.protocol)
            );
        });

        // Remove from the visualization directly
        if (edgeIds.length > 0) {
            console.log("Removing edges from visualization:", edgeIds);
            try {
                this.edges.remove(edgeIds);
            } catch (e) {
                console.warn("Error removing edges (they may not exist in the visualization):", e);
            }
        }
    }

    // Get current pool edges data
    getPoolEdges() {
        return this.poolEdges;
    }

    // Update the network structure (called when nodes change)
    updateNetworkStructure() {
        // Clear existing data
        this.nodes.clear();
        this.edges.clear();

        if (this.selectedNodes.size === 0) {
            return; // No nodes selected, leave network empty
        }

        // Add selected nodes
        const nodesToAdd = this.tokenNodes.filter(node =>
            this.selectedNodes.has(node.id)
        );
        this.nodes.add(nodesToAdd);

        // Add all edges that connect selected nodes
        const edgesToAdd = this.poolEdges.filter(edge =>
            this.selectedNodes.has(edge.from) &&
            this.selectedNodes.has(edge.to)
        ).map(edge => {
            // Create a copy of the edge to style appropriately
            const edgeCopy = {...edge};

            // Apply initial styling based on protocol selection
            this.styleEdgeByProtocol(edgeCopy);

            return edgeCopy;
        });

        // Add all processed edges
        this.edges.add(edgesToAdd);
    }

    // Update just the visual appearance of the edges (called when protocols change)
    updateEdgeAppearance() {
        if (this.edges.length === 0) {
            return; // No edges to update
        }

        // Get all current edges
        const currentEdges = this.edges.get();

        // Update each edge's appearance without changing structure
        currentEdges.forEach(edge => {
            // Apply styling based on protocol selection
            const updatedStyle = this.styleEdgeByProtocol({...edge});

            // Update only the visual properties
            this.edges.update({
                id: edge.id,
                color: updatedStyle.color,
                width: updatedStyle.width,
                dashes: updatedStyle.dashes
            });
        });
    }

    // Helper method to style an edge based on protocol selection
    styleEdgeByProtocol(edge) {
        // If the protocol is not selected, make the edge gray with reduced opacity
        if (!this.selectedProtocols.has(edge.protocol)) {
            edge.color = {
                color: '#aaaaaa', // Light gray color
                opacity: 0.4      // Reduced opacity
            };
            edge.width = edge.width * 0.7; // Slightly thinner
        } else {
            // Ensure color is properly set for selected protocols
            edge.color = protocolColorMap[edge.protocol].color;

            // Make sure width is set to original value
            edge.width = edge.width || 1;
        }

        return edge;
    }

    // Process websocket data and update the graph
    processWebSocketData(data) {
        console.log("Processing new websocket data");

        let result;
        if (data.new_pairs) {
            // Process the new_pairs data
            result = this.processNewPairs(data.new_pairs, data.spot_prices);
        }

        if (firstMessage) {
            // For the first message, do a full update
            this.updateNetworkStructure();
            firstMessage = false;
        } else if (result.addedNodes > 0 || result.addedEdges > 0) {
            // For subsequent messages, update incrementally

            // Add just the new nodes to the visualization if they're selected
            if (result.addedNodes > 0 && result.newTokenNodes) {
                const nodesToAdd = result.newTokenNodes.filter(node =>
                    this.selectedNodes.has(node.id)
                );
                if (nodesToAdd.length > 0) {
                    this.nodes.add(nodesToAdd);
                }
            }

            // Add just the new edges to the visualization using addPoolEdges
            if (result.addedEdges > 0 && result.newPoolEdges) {
                this.addPoolEdges(result.newPoolEdges);
            }
        }

    }

    // Process new pairs data specifically
    // Spot prices are maps of pair address to spot price, in token_0 -> token_1 direction
    processNewPairs(newPairs, spotPrices) {
        // Track new nodes and edges to add
        const newTokenNodes = [];
        const newPoolEdges = [];
        const tokenAddressMap = new Map(); // To avoid duplicate tokens

        // First, get all existing token symbols for reference
        const existingTokenAddresses = new Set(this.tokenNodes.map(node => node.id));

        // Iterate through each new pair
        Object.entries(newPairs).forEach(([poolAddress, pairData]) => {
            // Process tokens first
            pairData.tokens.forEach(token => {
                // Skip if we already have this token
                if (existingTokenAddresses.has(token.address) || tokenAddressMap.has(token.address)) {
                    return;
                }

                // Create a new token node
                if (token.symbol === "0x0000000000000000000000000000000000000000") {
                    token.symbol = "ETH";
                }
                const tokenNode = {
                    id: token.address,
                    size: 1,
                    label: token.symbol,
                };

                // Add to our tracking maps
                tokenAddressMap.set(token.address, tokenNode);
                if (tokenAddressMap.has(token.address)) {
                    newTokenNodes.push(tokenNode);
                }
            });

            // Now process the pair/edge
            // Find token IDs (either from existing tokens or newly added ones)
            let token0Id = pairData.tokens[0].address;
            let token1Id = pairData.tokens[1].address;

            // Find in existing tokens
            const token0Existing = this.tokenNodes.find(n => n.id === token0Id);
            const token1Existing = this.tokenNodes.find(n => n.id === token1Id);

            // If we have both tokens, create the edge
            if (token0Id && token1Id) {
                const poolEdge = {
                    from: token0Id,
                    to: token1Id,
                    width: 1, // Default width
                    protocol: pairData.protocol_system,
                    id: poolAddress,
                    spotPrice: spotPrices[poolAddress] || 1.0,
                };

                // Set color based on protocol
                if (poolEdge.protocol && protocolColorMap[poolEdge.protocol]) {
                    poolEdge.color = protocolColorMap[poolEdge.protocol].color;
                }

                newPoolEdges.push(poolEdge);
            }
        });

        // Now add the new nodes and edges to our data
        if (newTokenNodes.length > 0) {
            console.log(`Adding ${newTokenNodes.length} new token nodes`);
            this.tokenNodes = [...this.tokenNodes, ...newTokenNodes];
        }

        if (newPoolEdges.length > 0) {
            console.log(`Adding ${newPoolEdges.length} new pool edges`);
            this.poolEdges = [...this.poolEdges, ...newPoolEdges];
        }

        // Update the node selection UI if there are new nodes
        if (newTokenNodes.length > 0) {
            this.createNodeSelectionUI();
            this.populateTokenDropdowns();
        }

        return {
            addedNodes: newTokenNodes.length,
            addedEdges: newPoolEdges.length
        };
    }

    getNodeIdByLabel(symbol) {
        console.log("Finding node ID by symbol:", symbol);
        let node = this.tokenNodes.find(node => node.symbol === symbol)?.id;
    }

    // Add these methods to your GraphManager class

    // Keep track of highlighted elements
    highlightedNodes = new Set();
    highlightedEdges = new Set();

    /**
     * Highlight specific nodes and edges in the graph
     * @param {Array} nodeIds - Array of node IDs to highlight
     * @param {Array} edgeIds - Array of edge IDs to highlight
     */
    highlight(nodeIds, edgeIds) {
        // Reset any existing highlights first
        this.resetHighlights();

        // Store the highlighted elements
        this.highlightedNodes = new Set(nodeIds);
        this.highlightedEdges = new Set(edgeIds);

        // Update nodes
        if (nodeIds && nodeIds.length > 0) {
            const nodesToUpdate = [];

            nodeIds.forEach(nodeId => {
                nodesToUpdate.push({
                    id: nodeId,
                    borderWidth: 4,        // Increase border width
                    borderWidthSelected: 6, // Increase selected border width
                    value: 10,
                    size: 10,
                    color: {
                        border: '#FF9800',  // Orange border
                        highlight: {
                            border: '#FF5722' // Darker orange when selected
                        }
                    }
                });
            });

            // Apply updates to nodes
            if (nodesToUpdate.length > 0) {
                this.nodes.update(nodesToUpdate);
            }
        }

        // Update edges
        if (edgeIds && edgeIds.length > 0) {
            const edgesToUpdate = [];

            edgeIds.forEach(edgeId => {
                // Find the original edge to preserve its properties
                const originalEdge = this.edges.get(edgeId);

                if (originalEdge) {
                    // Store original protocol color
                    let originalColor = originalEdge.color;

                    // If the edge's protocol isn't selected, it would be gray
                    // In that case, get the original color from the protocol map
                    if (originalEdge.protocol &&
                        !this.selectedProtocols.has(originalEdge.protocol) &&
                        protocolColorMap[originalEdge.protocol]) {
                        originalColor = protocolColorMap[originalEdge.protocol].color;
                    }

                    edgesToUpdate.push({
                        id: edgeId,
                        width: 10,  // Triple the width
                        color: originalColor,           // Restore original color
                        dashes: false                   // Remove any dashes
                    });
                }
            });

            // Apply updates to edges
            if (edgesToUpdate.length > 0) {
                this.edges.update(edgesToUpdate);
            }
        }

        return {
            highlightedNodes: nodeIds ? nodeIds.length : 0,
            highlightedEdges: edgeIds ? edgeIds.length : 0
        };
    }

    /**
     * Reset all highlights to their original state
     */
    resetHighlights() {
        // Reset nodes
        if (this.highlightedNodes.size > 0) {
            const nodesToReset = [];

            this.highlightedNodes.forEach(nodeId => {
                nodesToReset.push({
                    id: nodeId,
                    borderWidth: undefined,        // Reset to default
                    borderWidthSelected: 3,        // Reset to default
                    color: {
                        border: "#ffffff",         // Reset to default
                        background: "#232323",     // Reset to default
                        highlight: {
                            border: "#000000",     // Reset to default
                            background: "#ffffff"  // Reset to default
                        }
                    }
                });
            });

            // Apply reset to nodes
            if (nodesToReset.length > 0) {
                this.nodes.update(nodesToReset);
            }
        }

        // Reset edges
        if (this.highlightedEdges.size > 0) {
            const edgesToReset = [];

            this.highlightedEdges.forEach(edgeId => {
                // Find the original edge in the poolEdges array
                const originalEdge = this.poolEdges.find(edge => edge.id === edgeId);

                if (originalEdge) {
                    // Create a styled copy of the edge
                    const styledEdge = this.styleEdgeByProtocol({...originalEdge});

                    // Add the update
                    edgesToReset.push({
                        id: edgeId,
                        width: originalEdge.width,  // Reset to original width
                        color: styledEdge.color,    // Reset to styled color
                        dashes: styledEdge.dashes   // Reset dashes if needed
                    });
                }
            });

            // Apply reset to edges
            if (edgesToReset.length > 0) {
                this.edges.update(edgesToReset);
            }
        }

        // Clear the sets
        this.highlightedNodes.clear();
        this.highlightedEdges.clear();

        return {
            resetNodes: true,
            resetEdges: true
        };
    }

    /**
     * Helper method to get token nodes
     * @returns {Array} - Array of token nodes
     */
    getTokenNodes() {
        return this.tokenNodes;
    }
}