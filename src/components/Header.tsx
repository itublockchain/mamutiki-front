import { ConnectWalletModal } from "@/modals/ConnectWalletModal";
import { CreateCampaignModal } from "@/modals/CreateCampaignModal";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useState } from "react";

type Props = {};

export function Header({}: Props) {
  const { connected, disconnect } = useWallet();

  const [isCreateCampaignModalOpen, setIsCreateCampaignModalOpen] =
    useState(false);

  const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] =
    useState(false);

  const handleDisconnectButton = async () => {
    disconnect();
  };

  const handleCreateButtonAtHeader = () => {
    setIsCreateCampaignModalOpen(true);
  };

  const handleConnectButton = () => {
    setIsConnectWalletModalOpen(true);
  };

  return (
    <>
      <nav
        id="header-root"
        className=" sticky top-0 w-full flex justify-center items-center h-32 backdrop-blur-sm z-[10]"
      >
        <div
          id="header"
          className="flex h-2/3 w-3/6 border border-gray-700 rounded-2xl items-center justify-between px-5 bg-black/70 backdrop-blur-3xl z-[10]"
        >
          <Link href="/">
            <div
              id="logo"
              className="text-default text-xl font-bold cursor-pointer"
            >
              Datagy
            </div>
          </Link>

          <div id="contents" className="flex flex-row gap-6 text-default">
            <div id="about">About</div>
            <div id="white-paper">White Paper</div>
          </div>

          {connected && (
            <div id="authed-left-part" className="flex gap-2">
              <Button onPress={handleCreateButtonAtHeader}>
                Create Campaign
              </Button>
              <Button onPress={handleDisconnectButton}>Disconnect</Button>
            </div>
          )}

          {!connected && (
            <Button onPress={handleConnectButton}>Connect Wallet</Button>
          )}
        </div>
      </nav>

      <CreateCampaignModal
        isModalOpen={isCreateCampaignModalOpen}
        setIsModalOpen={setIsCreateCampaignModalOpen}
      />

      <ConnectWalletModal
        isOpen={isConnectWalletModalOpen}
        setIsOpen={setIsConnectWalletModalOpen}
      />
    </>
  );
}
