// Initial data for the network visualization

export const protocols = [
    "uniswap_v2",
    "uniswap_v3",
];

export const protocolColorMap = {
    "uniswap_v2": {
        color: "#2f00ff",
        // highlight?: string,
        // hover?: string,
        // inherit?: boolean | string,
        // opacity?: number,
    },
    "uniswap_v3": {
        color: "#658808",
    }
}

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
    {id: "0x1234", from: 2, to: 8, value: 3, width: 1, protocol: "uniswap_v2", spot_price: 1.0},
    {id: "0x1235", from: 2, to: 9, value: 3, width: 1, protocol: "uniswap_v3", spot_price: 1.0},
    {id: "0x1236", from: 2, to: 10, value: 4, width: 1, protocol: "uniswap_v3", spot_price: 1.0},
    {id: "0x1237", from: 4, to: 6, value: 6, width: 1, protocol: "uniswap_v2", spot_price: 1.0},
    {id: "0x1238", from: 5, to: 7, value: 2, width: 1, protocol: "uniswap_v2", spot_price: 1.0},
    {id: "0x1239", from: 4, to: 5, value: 3, width: 1, protocol: "uniswap_v3", spot_price: 1.0},
    {id: "0x1230", from: 9, to: 10, value: 2, width: 1, protocol: "uniswap_v2", spot_price: 1.0},
    {id: "0x1241", from: 9, to: 10, value: 4, width: 1, protocol: "uniswap_v3", spot_price: 1.0},
    {id: "0x1242", from: 2, to: 3, value: 5, width: 1, protocol: "uniswap_v3", spot_price: 1.0},
    {id: "0x1243", from: 3, to: 9, value: 2, width: 1, protocol: "uniswap_v3", spot_price: 1.0},
    {id: "0x1244", from: 5, to: 3, value: 3, width: 1, protocol: "uniswap_v3", spot_price: 1.0},
    {id: "0x1245", from: 2, to: 7, value: 1, width: 1, protocol: "uniswap_v2", spot_price: 1.0},
    {id: "0x1246", from: 1, to: 4, value: 5, width: 1, protocol: "uniswap_v3", spot_price: 1.0},
    {id: "0x1247", from: 1, to: 5, value: 5, width: 1, protocol: "uniswap_v3", spot_price: 1.0},
];