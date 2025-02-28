import { ConnectWalletModal } from "@/modals/ConnectWalletModal";
import { CreateCampaignModal } from "@/modals/CreateCampaignModal";
import SubscribeModal from "@/modals/SubscribeModal";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import Link from "next/link";
import { useState } from "react";

import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useAptosClient } from "@/helpers/useAptosClient";

import { usePathname } from "next/navigation";
import { Bars3Icon } from "@heroicons/react/24/solid";

import MobileHeaderDrawer from "./MobileHeaderDrawer";

export function Header() {
  const { connected, account } = useWallet();

  const { isUsersNetworkCorrect } = useAptosClient();

  const [isCreateCampaignModalOpen, setIsCreateCampaignModalOpen] =
    useState(false);

  const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] =
    useState(false);

  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const pathname = usePathname();

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

  const handleHaburgerDrawButton = () => {
    setIsMobileDrawerOpen(true);
  };

  return (
    <>
      <div
        id="header-root"
        className="flex w-full flex-row justify-between items-center bg-black p-5 md:px-10 border-b border-primary/30 z-50"
        style={{
          position: pathname === "/" ? "fixed" : "sticky",
        }}
      >
        {/**
         * The left part of the header.
         * Contains the logo and the navigation links.
         * Has different components for mobile and desktop.
         */}
        <div
          id="left-part"
          className="flex flex-row gap-7 items-center text-sm"
        >
          <Link href="/" className="cursor-pointer">
            <img src="/logo.png" className="w-8 h-8" />
          </Link>

          <Link href="/" className="hidden md:flex text-gray-300">
            Home
          </Link>

          <Link href="/app" className="hidden md:flex text-gray-300">
            Marketplace
          </Link>

          <Link
            href="https://docs.datagora.xyz"
            className="hidden md:flex text-gray-300"
          >
            Docs
          </Link>
        </div>

        {/**
         * The right part of the header.
         * Contains the connect wallet button, create campaign button, user part and subscribe button.
         */}
        <div
          id="right-part"
          className="flex flex-row gap-5 md:gap-7 items-center"
        >
          {/**
           * Connect Wallet Button for desktop view.
           */}
          {!connected && (
            <div
              id="connect-button"
              className="hidden md:flex items-center cursor-pointer justify-center text-xs bg-primary py-1 px-3 rounded-xl text-black"
              onClick={handleConnectButton}
            >
              Connect Wallet
            </div>
          )}

          {/**
           * Connect wallet Button for mobile view.
           */}
          {!connected && (
            <div
              id="connect-button"
              className="flex md:hidden items-center cursor-pointer justify-center"
              onClick={handleConnectButton}
            >
              <img src="/header/wallet.png" className="w-8 h-8" />
            </div>
          )}

          {/**
           * Here is the account part.
           * It shows the user's address and profile picture.
           * It is only visible when the user is connected.
           * It is visible in both mobile and desktop views.
           * But have different styles for each view.
           */}
          {connected && (
            <div
              id="user-part"
              className="flex flex-row gap-2 items-center justify-center bg-white/10 rounded-xl md:py-1.5 md:px-3"
            >
              <img
                src="https://picsum.photos/200?random=1"
                className="w-7 h-7 rounded-full"
              />
              <div className="hidden md:flex text-xs text-gray-300">
                {account?.address.slice(0, 8) +
                  "..." +
                  account?.address.slice(-4)}
              </div>
            </div>
          )}

          {/**
           * Drawer button for mobile view.
           */}
          <div
            id="mobile-drawer-icon"
            className="flex justify-center items-center md:hidden cursor-pointer"
            onClick={handleHaburgerDrawButton}
          >
            <Bars3Icon className="w-8 h-8" />
          </div>

          {/**
           * Create Campaign Button for desktop view.
           */}
          {connected && (
            <div
              id="create-button"
              className="hidden md:flex flex-row items-center text-xs gap-2 text-primary cursor-pointer"
              onClick={handleCreateButtonAtHeader}
            >
              Create Campaign
              <PlusCircleIcon className="w-4 h-4 cursor-pointer" />
            </div>
          )}

          {/**
           * Subscribe button for desktop view.
           */}
          <div
            id="premium-part"
            className="hidden md:flex justify-center items-center"
          >
            <img
              src="/crown.png"
              className="w-8 h-8 cursor-pointer "
              onClick={handleSubscribeButton}
            />
          </div>
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

      <MobileHeaderDrawer
        isOpen={isMobileDrawerOpen}
        setIsOpen={setIsMobileDrawerOpen}
        setIsConnectWalletModalOpen={setIsConnectWalletModalOpen}
        setIsSubscribeModalOpen={setIsSubscribeModalOpen}
        setIsCreateCampaignModalOpen={setIsCreateCampaignModalOpen}
      />
    </>
  );
}
