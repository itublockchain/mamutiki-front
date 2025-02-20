"use client";

import LandingPage from "@/components/LandingPage/LandingPage";
import { GettingAuthStatusPage } from "@/components/GettingAuthStatusPage";
import { SignedMainPage } from "@/components/SignedMainPage";

import { useWallet } from "@aptos-labs/wallet-adapter-react";

export default function Home() {
  const { connected, isLoading } = useWallet();

  return (
    <div className="flex flex-col w-full h-full">
      {isLoading && <GettingAuthStatusPage />}
      {!isLoading && !connected && <LandingPage />}
      {!isLoading && connected && <SignedMainPage />}
    </div>
  );
}
