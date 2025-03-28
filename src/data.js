// Initial data for the network visualization

// Token nodes data
export const tokenNodes = [
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

// Pool edges data
export const poolEdges = [
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