# Tychonaut

![tychonaut.png](public/tychonaut.png)

Interactive web app for all Tycho features.

## Run Tycho API

Clone the repository, build, and run the Tycho API:
https://github.com/louise-poole/tycho-api

The command below is for Ethereum. You can also run on other chains.

```bash
cargo run -- --tvl-threshold 250
```

## Run Tychonaut Frontend

```bash
npm install

```

```bash
npm run dev
```

## Enjoy Space Exploration

![main_page.png](public/main_page.png)

## Features

### Token filters

Filters are available for all tokens that the Tycho API provides

### Protocol Highlights

You can choose which protocols to highlight.

### Live updates

Tycho API provides live updates of new blocks via websocket.
The updated pools are highlighted in the graph view.

### Solver and Swap

You can select tokens to swap and the solver will find the best path for you. The
solver algorithm is a simple graph search using spot prices.

### Execution

To be implemented
