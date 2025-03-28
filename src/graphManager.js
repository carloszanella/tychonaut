import {Network} from "vis-network";
import {DataSet} from "vis-data";
import {protocolColorMap} from './data.js';

// Graph Manager class to handle all network visualization operations
export class GraphManager {
    constructor(tokenNodes, poolEdges) {
        // Network components
        this.nodes = null;
        this.edges = null;
        this.network = null;
        this.selectedNodes = new Set(); // Track selected nodes

        // Set color of pool edges based on edge.protocol
        poolEdges.forEach(edge => {
            edge.color = protocolColorMap[edge.protocol].color;
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
                },
                // physics: {
                //     barnesHut: {
                //         springLength: 150,
                //     },
                // },
            },
            // edges: {
            //     widthConstraint: 10,
            // },
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

    // Toggle the visibility of a node
    toggleNode(nodeId, isVisible) {
        if (isVisible) {
            this.selectedNodes.add(nodeId);
        } else {
            this.selectedNodes.delete(nodeId);
        }

        // Update the network to reflect changes
        this.updateNetwork();
    }

    // Update the network based on selected nodes
    updateNetwork() {
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

        // Add edges that connect selected nodes
        const edgesToAdd = this.poolEdges.filter(edge =>
            this.selectedNodes.has(edge.from) && this.selectedNodes.has(edge.to)
        );
        this.edges.add(edgesToAdd);
    }

    // Select all nodes
    selectAllNodes() {
        this.tokenNodes.forEach(node => {
            this.selectedNodes.add(node.id);
            this.setCheckboxState(node.id, true);
        });
        this.updateNetwork();
    }

    // Deselect all nodes
    deselectAllNodes() {
        this.selectedNodes.clear();
        this.tokenNodes.forEach(node => {
            this.setCheckboxState(node.id, false);
        });
        this.updateNetwork();
    }

    // Reset the network (clear everything)
    resetNetwork() {
        this.deselectAllNodes();
    }

    // Set the state of a checkbox
    setCheckboxState(nodeId, checked) {
        const checkbox = document.getElementById(`node-${nodeId}`);
        if (checkbox) {
            checkbox.checked = checked;
        }
    }

    // Setup event listeners for control buttons
    setupEventListeners() {
        document.getElementById("select-all").addEventListener("click", () => this.selectAllNodes());
        document.getElementById("deselect-all").addEventListener("click", () => this.deselectAllNodes());
        document.getElementById("reset").addEventListener("click", () => this.resetNetwork());
    }

    // Public methods for external update

    // Get currently selected node IDs
    getSelectedNodes() {
        return [...this.selectedNodes];
    }

    // Add new pool edges:
    // Edge: {
    //  from: number,  - Source token Address
    //  to: number,  - Target token Address
    //  value: number,  - The TVL value of the pool
    //  protocol: string,
    // }
    addPoolEdges(newEdges) {
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
                edge => edge.from === updatedEdge.from && edge.to === updatedEdge.to
            );

            if (index !== -1) {
                // Update the edge value and width
                this.poolEdges[index].value = updatedEdge.value;
                this.poolEdges[index].width = updatedEdge.width || this.poolEdges[index].width;
            }
        });

        // Refresh the network with updated data
        this.updateNetwork();
    }

    // Remove pool edges
    removePoolEdges(edgesToRemove) {
        // edgesToRemove is an array of objects with from and to properties
        edgesToRemove.forEach(edgeToRemove => {
            this.poolEdges = this.poolEdges.filter(
                edge => !(edge.from === edgeToRemove.from && edge.to === edgeToRemove.to)
            );
        });

        // Refresh the network with updated data
        this.updateNetwork();
    }

    // Get current pool edges data
    getPoolEdges() {
        return this.poolEdges;
    }
}