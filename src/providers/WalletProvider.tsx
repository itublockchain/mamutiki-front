import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { NightlyWallet } from "@nightlylabs/aptos-wallet-adapter-plugin";
import { PropsWithChildren } from "react";

export function WalletProvider({ children }: PropsWithChildren) {
  const wallets = [new NightlyWallet()];

  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      plugins={wallets}
      onError={(error) => {
        console.error("Error from Wallet Adapter: ", error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
