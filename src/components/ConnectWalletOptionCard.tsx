import { AnyAptosWallet, useWallet } from "@aptos-labs/wallet-adapter-react";
import { Card, Image } from "@heroui/react";
import { useState } from "react";

type Props = {
  wallet: AnyAptosWallet;
  onConnect: () => void;
};

export function ConnectWalletOptionCard({ wallet, onConnect }: Props) {
  const [loading, setLoading] = useState(false);

  const { connect } = useWallet();

  const handlePress = async () => {
    if (loading) return;

    setLoading(true);
    try {
      connect(wallet.name);
    } catch (error) {
      console.error("Error on connecting to wallet: ", error);
    }
    setLoading(false);
    onConnect();
  };

  return (
    <Card
      isPressable
      className="flex flex-row w-full items-center gap-3 border border-gray-500 p-3"
      onPress={handlePress}
    >
      <Image src={wallet.icon} className="h-5" />
      <div className="">{wallet.name}</div>
      <div className="ml-auto bg-gray-500 p-3 rounded-xl text-xs">Connect</div>
    </Card>
  );
}
