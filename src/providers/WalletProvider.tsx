import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { PropsWithChildren } from "react";

export function WalletProvider({ children }: PropsWithChildren) {
  const wallets = [new MartianWallet()];

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
