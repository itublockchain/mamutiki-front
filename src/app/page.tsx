"use client";

import { AnonymousMainPage } from "@/components/AnonymousMainPage";
import { GettingAuthStatusPage } from "@/components/GettingAuthStatusPage";
import { SignedMainPage } from "@/components/SignedMainPage";

import { useWallet } from "@aptos-labs/wallet-adapter-react";

export default function Home() {
  const { connected, isLoading } = useWallet();

  return (
    <div className="flex flex-col w-full h-full px-10 py-5 ">
      {isLoading && <GettingAuthStatusPage />}
      {!isLoading && !connected && <AnonymousMainPage />}
      {!isLoading && connected && <SignedMainPage />}
    </div>
  );
}
