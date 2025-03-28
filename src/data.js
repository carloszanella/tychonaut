// Initial data for the network visualization

export const protocols = [
    "uniswap_v2",
    "uniswap_v3",
    "balancer_v2",
];

export const protocolColorMap = {
    "uniswap_v2": {
        color: "#7968df",
        // highlight?: string,
        // hover?: string,
        // inherit?: boolean | string,
        // opacity?: number,
    },
    "uniswap_v3": {
        color: "#96b642",
    },
    "balancer_v2": {
        color: "#f3985c",
    }
}

// Token nodes data
export const tokenNodes = [
    {id: 1, value: 1, label: "USDC"},
    {id: 2, value: 1, label: "WETH"},
    {id: 3, value: 1, label: "WBTC"},
    {id: 4, value: 1, label: "DAI"},
    {id: 5, value: 1, label: "USDT"},
    {id: 6, value: 1, label: "PEPE"},
    {id: 7, value: 1, label: "AAVE"},
    {id: 8, value: 1, label: "1INCH"},
    {id: 9, value: 1, label: "GNO"},
    {id: 10, value: 1, label: "LDO"},
];

// Pool edges data
export const poolEdges = [
    {id: "0x1234", from: 2, to: 8, width: 10, protocol: "uniswap_v2", spot_price: 1.0},
    {id: "0x1234a", from: 2, to: 1, width: 3, protocol: "uniswap_v2", spot_price: 1.0},
    {id: "0x1234b", from: 2, to: 4, width: 6, protocol: "uniswap_v3", spot_price: 1.0},
    {id: "0x1234c", from: 2, to: 6, width: 3, protocol: "balancer_v2", spot_price: 1.0},
    {id: "0x1234d", from: 2, to: 5, width: 6, protocol: "balancer_v2", spot_price: 1.0},
    {id: "0x1235", from: 2, to: 9, width: 3, protocol: "uniswap_v3", spot_price: 1.0},
    {id: "0x1236", from: 2, to: 10, width: 4, protocol: "uniswap_v3", spot_price: 1.0},
    {id: "0x1237", from: 4, to: 6, width: 12, protocol: "uniswap_v2", spot_price: 1.0},
    {id: "0x1238", from: 5, to: 7, width: 2, protocol: "uniswap_v2", spot_price: 1.0},
    {id: "0x1239", from: 4, to: 5, width: 3, protocol: "uniswap_v3", spot_price: 1.0},
    {id: "0x1230", from: 9, to: 10, width: 2, protocol: "uniswap_v2", spot_price: 1.0},
    {id: "0x1241", from: 9, to: 10, width: 4, protocol: "uniswap_v3", spot_price: 1.0},
    {id: "0x1242", from: 2, to: 3, width: 5, protocol: "uniswap_v3", spot_price: 1.0},
    {id: "0x1243", from: 3, to: 9, width: 2, protocol: "uniswap_v3", spot_price: 1.0},
    {id: "0x1244", from: 5, to: 3, width: 3, protocol: "uniswap_v3", spot_price: 1.0},
    {id: "0x1245", from: 2, to: 7, width: 1, protocol: "uniswap_v2", spot_price: 1.0},
    {id: "0x1246", from: 1, to: 4, width: 10, protocol: "uniswap_v3", spot_price: 1.0},
    {id: "0x1247", from: 1, to: 5, width: 5, protocol: "uniswap_v3", spot_price: 1.0},
];