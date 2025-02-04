"use client";

import { Header } from "@/components/Header";
import { AuthProvider } from "@/providers/AuthProvider";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      {/* "dark" is used for HeroUI, other "dark"s are handled by tailwindcss: Look for globals.css */}
      <body className="dark h-full">
        <div className="flex flex-col w-full h-full px-10 py-3">
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
