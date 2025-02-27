"use client";

import CreateCampaignFloatingButton from "@/components/CreateCampaignFloatingButton";
import LandingPage from "@/components/LandingPage/LandingPage";

export default function Home() {
  return (
    <>
      <div className="flex flex-col w-full h-full">
        <LandingPage />
      </div>

      <CreateCampaignFloatingButton />
    </>
  );
}
