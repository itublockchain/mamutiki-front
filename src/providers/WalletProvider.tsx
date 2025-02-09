import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import React, { PropsWithChildren } from "react";

export function WalletProvider({ children }: PropsWithChildren) {
  const wallets = [new MartianWallet()];

  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={true}
      onError={(error) => {
        console.error("Error from Wallet Adapter: ", error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
