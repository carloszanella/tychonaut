import {Network} from "vis-network";
import {DataSet} from "vis-data";

// Global variables for network components
let nodes = null;
let edges = null;
let network = null;
let selectedNodes = new Set(); // Track selected nodes

// Store the original data for reset functionality
const tokenNodes = [
    {id: 1, value: 1, label: "USDC", size: 1},
    {id: 2, value: 1, label: "WETH", size: 1},
    {id: 3, value: 1, label: "WBTC", size: 1},
    {id: 4, value: 1, label: "DAI", size: 1},
    {id: 5, value: 1, label: "USDT", size: 1},
    {id: 6, value: 1, label: "PEPE", size: 1},
    {id: 7, value: 1, label: "AAVE", size: 1},
    {id: 8, value: 1, label: "1INCH", size: 1},
    {id: 9, value: 1, label: "GNO", size: 1},
    {id: 10, value: 1, label: "LDO", size: 1},
];

const poolEdges = [
    {from: 2, to: 8, value: 3, width: 1},
    {from: 2, to: 9, value: 3, width: 1},
    {from: 2, to: 10, value: 4, width: 1},
    {from: 4, to: 6, value: 6, width: 1},
    {from: 5, to: 7, value: 2, width: 1},
    {from: 4, to: 5, value: 3, width: 1},
    {from: 9, to: 10, value: 2, width: 1},
    {from: 2, to: 3, value: 1, width: 1},
    {from: 3, to: 9, value: 2, width: 1},
    {from: 5, to: 3, value: 3, width: 1},
    {from: 2, to: 7, value: 1, width: 1},
];

// Initialize the network with empty data
function initializeNetwork() {
    // Create empty datasets
    nodes = new DataSet([]);
    edges = new DataSet([]);

    const container = document.getElementById("mynetwork");
    const data = {
        nodes: nodes,
        edges: edges,
    };

    const options = {
        nodes: {
            shape: "circle",
            //     size: 10,
            font: {
                size: 10,
            },
            //     physics: {
            //         barnesHut: {
            //             springLength: 600,
            //         },
            //     },
            // },
            // edges: {
            //     width: 0.15,
        },
    };

    // Create the network
    network = new Network(container, data, options);
}

// Create checkboxes for node selection
function createNodeSelectionUI() {
    const nodeSelectionContainer = document.getElementById("node-selection");

    if (!nodeSelectionContainer) {
        console.error("Node selection container not found");
        return;
    }

    // Clear any existing content
    nodeSelectionContainer.innerHTML = "";

    // Create a checkbox for each token node
    tokenNodes.forEach((node) => {
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
            toggleNode(node.id, checkbox.checked);
        });
    });
}

// Toggle the visibility of a node
function toggleNode(nodeId, isVisible) {
    if (isVisible) {
        selectedNodes.add(nodeId);
    } else {
        selectedNodes.delete(nodeId);
    }

    // Update the network to reflect changes
    updateNetwork();
}

// Update the network based on selected nodes
function updateNetwork() {
    // Clear existing data
    nodes.clear();
    edges.clear();

    if (selectedNodes.size === 0) {
        return; // No nodes selected, leave network empty
    }

    // Add selected nodes
    const nodesToAdd = tokenNodes.filter(node =>
        selectedNodes.has(node.id)
    );
    nodes.add(nodesToAdd);

    // Add edges that connect selected nodes
    const edgesToAdd = poolEdges.filter(edge =>
        selectedNodes.has(edge.from) && selectedNodes.has(edge.to)
    );
    edges.add(edgesToAdd);
}

// Select all nodes
function selectAllNodes() {
    tokenNodes.forEach(node => {
        selectedNodes.add(node.id);
        setCheckboxState(node.id, true);
    });
    updateNetwork();
}

// Deselect all nodes
function deselectAllNodes() {
    selectedNodes.clear();
    tokenNodes.forEach(node => {
        setCheckboxState(node.id, false);
    });
    updateNetwork();
}

// Reset the network (clear everything)
function resetNetwork() {
    deselectAllNodes();
}

// Set the state of a checkbox
function setCheckboxState(nodeId, checked) {
    const checkbox = document.getElementById(`node-${nodeId}`);
    if (checkbox) {
        checkbox.checked = checked;
    }
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById("select-all").addEventListener("click", selectAllNodes);
    document.getElementById("deselect-all").addEventListener("click", deselectAllNodes);
    document.getElementById("reset").addEventListener("click", resetNetwork);
}

// Initialize everything when the page loads
window.addEventListener("load", () => {
    initializeNetwork();
    createNodeSelectionUI();
    setupEventListeners();
});