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
    <html lang="en" className="myTheme">
      <body className="relative ">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
