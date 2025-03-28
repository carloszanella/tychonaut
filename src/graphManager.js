import {Network} from "vis-network";
import {DataSet} from "vis-data";
import {protocolColorMap, protocols} from './data.js';

// Graph Manager class to handle all network visualization operations
export class GraphManager {
    constructor(tokenNodes, poolEdges) {
        // Network components
        this.nodes = null;
        this.edges = null;
        this.network = null;
        this.selectedNodes = new Set(); // Track selected nodes
        this.selectedProtocols = new Set(); // Track selected protocols

        // Set color of pool edges based on edge.protocol
        poolEdges.forEach(edge => {
            if (edge.protocol && protocolColorMap[edge.protocol]) {
                edge.color = protocolColorMap[edge.protocol].color;
            }
        });

        // Store the token and pool data
        this.tokenNodes = tokenNodes;
        this.poolEdges = poolEdges;

        // Initialize the network
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
            nodes: {
                shape: "circle",
                color: {
                    border: "#000000",
                    background: "#ffffff",
                    highlight: {
                        border: "#000000",
                        background: "#ffffff",
                    }
                },
                borderWidthSelected: 3,
                font: {
                    size: 10,
                    color: "#000000",
                },
            },
            physics: {
                // solver: "repulsion",
                // repulsion: {
                //     nodeDistance: 70,
                // }
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
        });

        // Add the new edges to the stored data
        this.poolEdges = [...this.poolEdges, ...newEdges];

        // Refresh the network with updated data
        this.updateNetwork();
    }

    // Update existing pool values
    updatePoolValues(updatedEdges) {
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
            }
        });

        // Refresh the network with updated data
        this.updateNetwork();
    }

    // Remove pool edges
    removePoolEdges(edgesToRemove) {
        // edgesToRemove is an array of objects with from, to, and protocol properties
        edgesToRemove.forEach(edgeToRemove => {
            this.poolEdges = this.poolEdges.filter(
                edge => !(edge.from === edgeToRemove.from &&
                    edge.to === edgeToRemove.to &&
                    edge.protocol === edgeToRemove.protocol)
            );
        });

        // Refresh the network with updated data
        this.updateNetwork();
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
}