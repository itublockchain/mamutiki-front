// app/providers.tsx
"use client";

import { AuthProvider } from "@/providers/AuthProvider";
import { WalletProvider } from "@/providers/WalletProvider";
import { HeroUIProvider } from "@heroui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <WalletProvider>
        <AuthProvider>{children}</AuthProvider>
      </WalletProvider>
    </HeroUIProvider>
  );
}
