"use client";

import { WalletProvider } from "@/providers/WalletProvider";
import { HeroUIProvider } from "@heroui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <WalletProvider>{children}</WalletProvider>
    </HeroUIProvider>
  );
}
