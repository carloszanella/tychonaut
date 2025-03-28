import {Network} from "vis-network";
import {DataSet} from "vis-data";

// Graph Manager class to handle all network visualization operations
export class GraphManager {
    constructor(tokenNodes, poolEdges) {
        // Network components
        this.nodes = null;
        this.edges = null;
        this.network = null;
        this.selectedNodes = new Set(); // Track selected nodes

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
                // size: 10,
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
            //     width: 0.15,
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

    // Update node data - can be called from external loop
    updateNodeData(newNodeData) {
        // Update the stored node data
        this.tokenNodes = newNodeData;

        // Refresh the network with new data
        this.updateNetwork();

        // Optionally refresh the UI if node structure has changed
        // this.createNodeSelectionUI();
    }

    // Update edge data - can be called from external loop
    updateEdgeData(newEdgeData) {
        // Update the stored edge data
        this.poolEdges = newEdgeData;

        // Refresh the network with new data
        this.updateNetwork();
    }

    // Get current nodes data
    getNodeData() {
        return this.tokenNodes;
    }

    // Get current edges data
    getEdgeData() {
        return this.poolEdges;
    }

    // Get currently selected node IDs
    getSelectedNodes() {
        return [...this.selectedNodes];
    }
}