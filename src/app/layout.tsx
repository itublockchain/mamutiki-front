"use client";

import { Header } from "@/components/Header";
import "./globals.css";

import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="px-10 py-5">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
