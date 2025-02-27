import { useAptosClient } from "@/helpers/useAptosClient";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { Drawer, DrawerContent } from "@heroui/react";
import Link from "next/link";
import React from "react";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsConnectWalletModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubscribeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCreateCampaignModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function MobileHeaderDrawer({
  isOpen,
  setIsOpen,
  setIsConnectWalletModalOpen,
  setIsSubscribeModalOpen,
  setIsCreateCampaignModalOpen,
}: Props) {
  const { connected, account, disconnect } = useWallet();
  const { isUsersNetworkCorrect } = useAptosClient();

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleConnectButton = () => {
    setIsOpen(false);
    setIsConnectWalletModalOpen(true);
  };

  const handleSubscribeButton = () => {
    if (!connected) return handleConnectButton();

    setIsOpen(false);
    setIsSubscribeModalOpen(true);
  };

  const handleCreateButtonAtHeader = () => {
    if (!connected) return handleConnectButton();

    const networkCorrect = isUsersNetworkCorrect();
    if (!networkCorrect) return;

    setIsOpen(false);

    setIsCreateCampaignModalOpen(true);
  };

  return (
    <>
      <Drawer
        className="flex md:hidden bg-black "
        isOpen={isOpen}
        onClose={handleClose}
        closeButton={<div className="w-0 h-0" />}
      >
        <DrawerContent className="flex flex-col">
          <div
            id="fake-header"
            className="flex flex-row justify-between items-center p-5 border-b  border-primary/30"
          >
            <div
              id="left-part"
              className="flex flex-row gap-7 items-center text-xs"
            >
              <Link href="/" className="cursor-pointer" onClick={handleClose}>
                <img src="/logo.png" className="w-8 h-8" />
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
                    {account?.address.slice(0, 15)}...
                  </div>
                </div>
              )}

              {/**
               * Close button for mobile view.
               */}
              <div
                id="mobile-drawer-icon"
                className="flex justify-center items-center md:hidden cursor-pointer"
                onClick={handleClose}
              >
                <ArrowUturnLeftIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div
            id="links"
            className="flex flex-col gap-5 p-8 text-gray-200 text-lg"
          >
            <Link href="/" onClick={handleClose}>
              Home
            </Link>
            <Link href="/app" onClick={handleClose}>
              Market Place
            </Link>
            <Link href="https://docs.datagora.xyz" onClick={handleClose}>
              Docs
            </Link>
          </div>

          <div
            id="divider-container"
            className="flex items-center justify-center w-full px-8"
          >
            <div className="flex w-full border border-gray-600" />
          </div>

          <div
            id="premium-campaign-part"
            className="flex flex-col justify-center gap-5 px-8 py-5"
          >
            <div
              id="premium-part"
              className="flex flex-row justify-start items-center gap-3 cursor-pointer"
              onClick={handleSubscribeButton}
            >
              <div id="icon-part" className="flex">
                <img src="/crown.png" className="w-9 h-9" />
              </div>
              <div
                id="text-part"
                className="flex text-primary text-large font-bold"
              >
                Buy Premium
              </div>
            </div>

            <div
              id="create-part"
              className="flex flex-row justify-start items-center gap-3 cursor-pointer"
              onClick={handleCreateButtonAtHeader}
            >
              <div id="icon-part" className="flex p-1.5">
                <img src="/header/add.png" className="w-6 h-6" />
              </div>
              <div
                id="text-part"
                className="flex text-primary text-large font-bold"
              >
                Create Campaign
              </div>
            </div>
          </div>

          <div
            id="divider-container"
            className="flex items-center justify-center w-full px-8"
          >
            <div className="flex w-full border border-gray-600" />
          </div>

          {connected && (
            <div
              id="profile-disconnect-part"
              className="flex flex-col gap-10 p-8"
            >
              <div
                id="profile-part"
                className="flex flex-row items-center gap-3"
              >
                <div id="icon-part" className="flex">
                  <img
                    src="https://picsum.photos/200?random=1"
                    className="w-8 h-8 rounded-full"
                  />
                </div>
                <div id="text-part" className="flex text-xl text-gray-200">
                  See Profile
                </div>
              </div>

              <div
                id="disconnect-part"
                className="flex flex-row items-center gap-3 cursor-pointer"
                onClick={disconnect}
              >
                <div id="text-part" className="flex text-xl text-gray-200">
                  Disconnect Wallet
                </div>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
