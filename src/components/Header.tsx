import { useAptosClient } from "@/helpers/useAptosClient";
import { ConnectWalletModal } from "@/modals/ConnectWalletModal";
import { CreateCampaignModal } from "@/modals/CreateCampaignModal";
import SubscribeModal from "@/modals/SubscribeModal";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Spinner } from "@heroui/react";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const { connected, disconnect } = useWallet();

  const { currentNetworkName } = useAptosClient();

  const [isCreateCampaignModalOpen, setIsCreateCampaignModalOpen] =
    useState(false);

  const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] =
    useState(false);

  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);

  const handleStartButton = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSpecsButton = () => {
    window.scrollTo({
      top: window.innerHeight * 1,
      behavior: "smooth",
    });
  };

  const handleRoadmapButton = () => {
    window.scrollTo({
      top: window.innerHeight * 2,
      behavior: "smooth",
    });
  };

  const handleDisconnectButton = async () => {
    disconnect();
  };

  const handleCreateButtonAtHeader = () => {
    setIsCreateCampaignModalOpen(true);
  };

  const handleConnectButton = () => {
    setIsConnectWalletModalOpen(true);
  };

  const handleSubscribeButton = () => {
    setIsSubscribeModalOpen(true);
  };

  return (
    <>
      <nav
        id="header-root"
        className={`${
          connected ? "sticky" : "fixed"
        } top-0 z-50 w-full flex items-center justify-center p-5 px-20 gap-5`}
      >
        {connected && (
          <div
            id="button"
            className="flex mr-auto px-3 py-2 border border-yellow-300 rounded-2xl text-white text-xs font-bold"
          >
            15 MAMU
          </div>
        )}

        <div
          id="header-content"
          className="flex flex-row gap-5 items-center justify-center border border-white/15 rounded-full p-2 px-5 bg-black/50 backdrop-blur-md"
        >
          <Link href="/">
            <img src="/icon.png" width={20} />
          </Link>

          {!connected && (
            <>
              <div
                id="start-button"
                className="text-sm cursor-pointer"
                onClick={handleStartButton}
              >
                Start
              </div>
              <div
                id="specs-button"
                className="text-sm cursor-pointer"
                onClick={handleSpecsButton}
              >
                Specs
              </div>
              <div
                id="roadmap-button"
                className="text-sm cursor-pointer"
                onClick={handleRoadmapButton}
              >
                Roadmap
              </div>

              <div
                id="button"
                className="flex px-3 py-2 bg-yellow-300 rounded-2xl text-black cursor-pointer text-xs"
                onClick={handleConnectButton}
              >
                Connect Wallet
              </div>
            </>
          )}

          {connected && (
            <>
              <div
                id="create-button"
                className="text-sm cursor-pointer"
                onClick={handleCreateButtonAtHeader}
              >
                Create
              </div>
              <div
                id="subscribe-button"
                className="text-sm cursor-pointer"
                onClick={handleSubscribeButton}
              >
                Subscribe
              </div>
              <div
                id="button"
                className="flex px-3 py-2 bg-yellow-300 rounded-2xl text-black cursor-pointer text-xs font-bold"
                onClick={handleDisconnectButton}
              >
                Disconnect
              </div>
            </>
          )}
        </div>

        {connected && (
          <div
            id="button"
            className="flex ml-auto px-3 py-2 border border-yellow-300 rounded-2xl text-white text-xs font-bold"
          >
            {currentNetworkName ? (
              currentNetworkName.toUpperCase()
            ) : (
              <Spinner size="sm" />
            )}
          </div>
        )}
      </nav>

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
