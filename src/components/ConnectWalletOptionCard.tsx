import { AnyAptosWallet, useWallet } from "@aptos-labs/wallet-adapter-react";
import { motion } from "framer-motion";
import { useState } from "react";

type Props = {
  wallet: AnyAptosWallet;
};

export function ConnectWalletOptionCard({ wallet }: Props) {
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
  };

  return (
    <motion.div
      id="wallet-root"
      className="flex flex-row w-full items-center justify-between border border-yellow-500 rounded-2xl p-2 px-3 cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={handlePress}
    >
      <div
        id="image-name"
        className="flex flex-row items-center justify-center gap-2"
      >
        <img src={wallet.icon} alt={wallet.name} className="w-5 h-5" />
        <div className="text-sm">{wallet.name}</div>
      </div>
      <div
        id="connect-button"
        className="flex text-xs px-3 p-2 bg-yellow-300 rounded-2xl text-black"
      >
        Connect
      </div>
    </motion.div>
  );
}
