// app/providers.tsx
"use client";

import { AuthProvider } from "@/providers/AuthProvider";
import { HeroUIProvider } from "@heroui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <AuthProvider>{children}</AuthProvider>
    </HeroUIProvider>
  );
}
