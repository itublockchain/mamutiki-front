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
import { usePathname } from "next/navigation";

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

  const [routeStatus, setRouteStatus] = useState<"landing" | "app">("landing");

  const pathname = usePathname();

  // Managing the route status
  useEffect(() => {
    if (pathname === "/") {
      setRouteStatus("landing");
    } else {
      setRouteStatus("app");
    }
  }, [pathname]);

  // Fetching the balance of the account
  useEffect(() => {
    if (isAptosClientReady && connected && routeStatus === "app") {
      handleGetCurrentBalance();
    }
  }, [isAptosClientReady, connected, routeStatus]);

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
    if (!connected) return handleConnectButton();

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
      {/**
       * We have two types of header.
       * - Landing Header
       * - App Header
       */}

      {/**
       * We are chaning the header style based on the route status.
       * - Landing Header : Fixed
       * - App Header : Sticky
       */}
      <nav
        id="header-root"
        className={`${
          routeStatus === "app" ? "sticky" : "fixed"
        } top-0 z-50 w-full flex items-center justify-center p-5 md:p-5 md:px-20 md:gap-5`}
      >
        {/**
         * Below elements will be shown only when the route is app and connected.
         * - Current Balance
         */}
        {routeStatus === "app" && connected && (
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

          {/**
           * Below Elements will be fixed shown in the header whether connected or not.
           * - Start Button
           * - Specs Button
           * - Roadmap Button
           * - Launch App Button (Desktop)
           * - Launch App Button (Mobile)
           */}
          {routeStatus === "landing" && (
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

              <Link
                href="/app"
                id="button"
                className="hidden md:flex items-center justify-center text-center px-3 py-2 bg-yellow-300 rounded-2xl text-black cursor-pointer text-xs"
              >
                Launch App
              </Link>

              <Link
                href="/app"
                id="button"
                className="flex md:hidden p-2 items-center justify-center text-center bg-yellow-300 rounded-2xl text-black cursor-pointer text-xs"
              >
                Launch
              </Link>
            </>
          )}

          {/**
           * Here contains some elements that only rendered when wallet connected.
           * - Connect Button (Dynamic)
           * - Disconnect Button (Dynamic)
           * - Hamburger Menu (Mobile Devices) (Dynamic)
           *
           * - Create Button (Static)
           * - Subscribe Button (Static)
           */}
          {routeStatus === "app" && (
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

              {/**
               * Below connect button only renders on desktop devices.
               * See next button element for mobile devices.
               */}
              {!connected && (
                <div
                  id="button"
                  className="hidden md:flex px-3 py-2 bg-yellow-300 rounded-2xl text-black cursor-pointer text-xs font-bold"
                  onClick={handleConnectButton}
                >
                  Connect Wallet
                </div>
              )}

              {/**
               * Below connect button only renders on mobile devices. See above element for desktop devices.
               */}
              {!connected && (
                <div
                  id="button"
                  className="flex md:hidden p-2 items-center justify-center text-center bg-yellow-300 rounded-2xl text-black cursor-pointer text-xs"
                  onClick={handleConnectButton}
                >
                  Connect
                </div>
              )}

              {/**
               * Below disconnect button only renders on desktop.
               * See next below element (Hamburger menu) for mobile devices's disconnect button.
               */}
              {connected && (
                <div
                  id="button"
                  className="hidden md:flex px-3 py-2 bg-yellow-300 rounded-2xl text-black cursor-pointer text-xs font-bold"
                  onClick={handleDisconnectButton}
                >
                  Disconnect
                </div>
              )}

              {/**
               * Hamburger menu contans only connected elements.
               */}
              {connected && (
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
              )}
            </>
          )}
        </div>

        {/**
         * Below elements will be shown only when the route is app and connected.
         * - Network Name
         */}
        {routeStatus === "app" && connected && (
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
