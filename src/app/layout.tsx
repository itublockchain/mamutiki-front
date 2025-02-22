"use client";

import { Header } from "@/components/Header";
import "./globals.css";

import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

import { Lato } from "next/font/google";

const lato = Lato({
  weight: ["100", "300", "400", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-lato",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`myTheme ${lato.className}`}>
      <HeadComponent />
      <body className="relative">
        <Providers>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "black",
                padding: "16px",
                color: "white",
                overflow: "scroll",
              },
            }}
          />

          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}

const HeadComponent = () => (
  <head>
    {/* Basic Metadata */}
    <title>Notiphar • Find Data You Need</title>
    <meta name="description" content="Make Every Event Unique" />

    {/* Icons for Light and Dark Modes */}
    <link rel="icon" type="image/png" href="/icon.png" />

    {/* Open Graph Metadata */}
    <meta property="og:title" content="Notiphar • Find Data You Need" />
    <meta
      property="og:description"
      content={"Notiphar is a platform where you can find data you need."}
    />
    <meta property="og:url" content="https://notiphar.com" />
    <meta property="og:site_name" content="Notiphar" />
    <meta property="og:image" content="https://notiphar.com/images/og.png" />
    <meta property="og:locale" content="en-US" />
    <meta property="og:type" content="website" />
  </head>
);
