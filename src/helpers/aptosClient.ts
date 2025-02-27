import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const network = process.env.API_NETWORK as "devnet" | "testnet" | "mainnnet";

const url =
  network === "testnet"
    ? process.env.NEXT_PUBLIC_MOVEMENT_TEST_NETWORK_BARDOCK_URL
    : network === "mainnnet"
    ? process.env.NEXT_PUBLIC_MOVEMENT_MAIN_NETWORK_URL
    : undefined;
if (!url) {
  throw new Error(
    `Invalid URL for the choosen network from .env file: ${network} `
  );
}

export const aptosClient = new Aptos(
  new AptosConfig({
    network: Network.CUSTOM,
    fullnode: url,
  })
);
