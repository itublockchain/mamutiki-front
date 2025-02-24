import { useAptosClient } from "@/helpers/useAptosClient";
import { ConnectWalletModal } from "@/modals/ConnectWalletModal";
import { CreateCampaignModal } from "@/modals/CreateCampaignModal";
import SubscribeModal from "@/modals/SubscribeModal";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Spinner } from "@heroui/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";

import { Bars3Icon } from "@heroicons/react/24/solid";

export function Header() {
  const { connected, disconnect } = useWallet();

  const { currentNetworkName, isAptosClientReady, getBalanceOfAccount } =
    useAptosClient();

  const [isCreateCampaignModalOpen, setIsCreateCampaignModalOpen] =
    useState(false);

  const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] =
    useState(false);

  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);

  const [currentBalance, setCurrentBalance] = useState<number | false>(false);

  useEffect(() => {
    if (isAptosClientReady) {
      handleGetCurrentBalance();
    }
  }, [isAptosClientReady]);

  const handleGetCurrentBalance = async () => {
    if (!isAptosClientReady) return setCurrentBalance(false);

    const balance = await getBalanceOfAccount();
    if (balance === false) {
      setCurrentBalance(false);
    } else {
      setCurrentBalance(balance);
    }
  };

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
        } top-0 z-50 w-full flex items-center justify-center p-5 md:p-5 md:px-20 md:gap-5`}
      >
        {connected && (
          <div
            id="button"
            className="hidden md:flex mr-auto px-3 py-2 border justify-center items-center border-yellow-300 rounded-2xl text-white text-xs font-bold bg-black/50 backdrop-blur-md"
          >
            {currentBalance === false ? (
              <Spinner size="sm" />
            ) : (
              `${currentBalance} MAMU`
            )}
          </div>
        )}

        <div
          id="header-content"
          className="flex flex-row gap-5 items-center justify-center border border-white/15 rounded-full p-2 px-5 bg-black/50 backdrop-blur-md"
        >
          <Link href="/" className="flex w-5 h-5">
            <img src="/icon.png" className="w-5 aspect-square rounded-full" />
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
                className="hidden md:flex items-center justify-center text-center px-3 py-2 bg-yellow-300 rounded-2xl text-black cursor-pointer text-xs"
                onClick={handleConnectButton}
              >
                Connect Wallet
              </div>

              <div
                id="button"
                className="flex md:hidden p-2 items-center justify-center text-center bg-yellow-300 rounded-2xl text-black cursor-pointer text-xs"
                onClick={handleConnectButton}
              >
                Connect
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
                Premium
              </div>
              <div
                id="button"
                className="hidden md:flex px-3 py-2 bg-yellow-300 rounded-2xl text-black cursor-pointer text-xs font-bold"
                onClick={handleDisconnectButton}
              >
                Disconnect
              </div>

              <Dropdown className="md:hidden">
                <DropdownTrigger className="md:hidden">
                  <div
                    id="button"
                    className="flex p-2 bg-yellow-300 rounded-2xl text-black cursor-pointer text-xs font-bold"
                  >
                    <Bars3Icon className="w-4 h-4" />
                  </div>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Static Actions"
                  disabledKeys={["network", "balance"]}
                >
                  <DropdownItem key="network" className="cursor-pointer">
                    {currentNetworkName ? (
                      currentNetworkName.toUpperCase()
                    ) : (
                      <Spinner size="sm" />
                    )}
                  </DropdownItem>

                  <DropdownItem key="balance" className="cursor-pointer">
                    {currentBalance === false ? (
                      <Spinner size="sm" />
                    ) : (
                      `${currentBalance} MAMU`
                    )}
                  </DropdownItem>

                  <DropdownItem
                    key="disconnect"
                    onPress={handleDisconnectButton}
                    className="cursor-pointer text-danger-500"
                    color="danger"
                  >
                    Disconnect
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          )}
        </div>

        {connected && (
          <div
            id="button"
            className="hidden md:flex ml-auto px-3 py-2 border border-yellow-300 rounded-2xl text-white text-xs font-bold bg-black/50 backdrop-blur-md"
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
