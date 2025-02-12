import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const network = process.env.API_NETWORK as "devnet" | "testnet" | "mainner";

export const aptosClient = new Aptos(
  new AptosConfig({
    network:
      network === "devnet"
        ? Network.DEVNET
        : network === "testnet"
        ? Network.TESTNET
        : Network.MAINNET,
  })
);
