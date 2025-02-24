"use client";

import { WalletProvider } from "@/providers/WalletProvider";
import { HeroUIProvider } from "@heroui/react";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider
      height="1.5px"
      color="#FFF540"
      options={{
        showSpinner: false,
      }}
    >
      <HeroUIProvider>
        <WalletProvider>{children}</WalletProvider>
      </HeroUIProvider>
    </ProgressProvider>
  );
}
