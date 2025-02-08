"use client";

import { AnonymousMainPage } from "@/components/AnonymousMainPage";
import { GettingAuthStatusPage } from "@/components/GettingAuthStatusPage";
import { SignedMainPage } from "@/components/SignedMainPage";

import { useAuth } from "@/providers/AuthProvider";

export default function Home() {
  const { loading, user } = useAuth();

  return (
    <div className="flex flex-col w-full h-full px-10 py-5 ">
      {loading && <GettingAuthStatusPage />}
      {!loading && !user && <AnonymousMainPage />}
      {!loading && user && <SignedMainPage />}
    </div>
  );
}
