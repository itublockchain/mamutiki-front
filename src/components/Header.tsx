import { ConnectWalletModal } from "@/modals/ConnectWalletModal";
import { CreateCampaignModal } from "@/modals/CreateCampaignModal";
import SubscribeModal from "@/modals/SubscribeModal";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import Link from "next/link";
import { useState } from "react";

import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useAptosClient } from "@/helpers/useAptosClient";

export function Header() {
  const { connected, account, disconnect } = useWallet();

  const { isUsersNetworkCorrect } = useAptosClient();

  const [isCreateCampaignModalOpen, setIsCreateCampaignModalOpen] =
    useState(false);

  const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] =
    useState(false);

  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);

  const handleCreateButtonAtHeader = () => {
    if (!connected) return handleConnectButton();

    const networkCorrect = isUsersNetworkCorrect();
    if (!networkCorrect) return;

    setIsCreateCampaignModalOpen(true);
  };

  const handleConnectButton = () => {
    setIsConnectWalletModalOpen(true);
  };

  const handleSubscribeButton = () => {
    if (!connected) return handleConnectButton();

    setIsSubscribeModalOpen(true);
  };

  return (
    <>
      <div
        id="header-root"
        className="sticky flex flex-row justify-between items-center bg-black z-50 p-5 px-10 border-b border-primary/30"
      >
        <div
          id="left-part"
          className="flex flex-row gap-7 items-center text-xs"
        >
          <Link href="/">
            <img src="/logo.png" className="w-8 h-8 cursor-pointer" />
          </Link>
          <Link href="/" className="text-gray-300">
            Home
          </Link>
          <Link href="/app" className="text-gray-300">
            Marketplace
          </Link>
        </div>

        <div id="right-part" className="flex flex-row gap-7 items-center">
          {!connected && (
            <div
              id="connect-button"
              className="flex items-center cursor-pointer justify-center text-xs bg-primary py-1 px-3 rounded-xl text-black"
              onClick={handleConnectButton}
            >
              Connect Wallet
            </div>
          )}

          {connected && (
            <div
              id="create-button"
              className="flex flex-row items-center text-xs gap-2 text-primary cursor-pointer"
              onClick={handleCreateButtonAtHeader}
            >
              Create Campaign
              <PlusCircleIcon className="w-4 h-4 cursor-pointer" />
            </div>
          )}

          {connected && (
            <div
              id="user-part"
              className="flex flex-row gap-2 items-center justify-center bg-white/10 rounded-xl py-1.5 px-3"
            >
              <img
                src="https://picsum.photos/200?random=1"
                className="w-6 h-6 rounded-full"
              />
              <div className="text-xs text-gray-300">
                {account?.address.slice(0, 15)}...
              </div>
            </div>
          )}

          <img
            src="/crown.png"
            className="w-8 h-8 cursor-pointer "
            onClick={handleSubscribeButton}
          />
        </div>
      </div>

      <CreateCampaignModal
        isModalOpen={isCreateCampaignModalOpen}
        setIsModalOpen={setIsCreateCampaignModalOpen}
      />

      <ConnectWalletModal
        isOpen={isConnectWalletModalOpen}
        setIsOpen={setIsConnectWalletModalOpen}
      />

      <SubscribeModal
        isOpen={isSubscribeModalOpen}
        setIsOpen={setIsSubscribeModalOpen}
      />
    </>
  );
}
