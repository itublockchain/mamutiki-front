import { firestore } from "@/firebase/clientApp";
import { CampaignDocData } from "@/types/Campaign";
import { Spinner } from "@heroui/react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { CampaignCard } from "./CampaignCard";

type Props = {};

export function CurrentCampaigns({}: Props) {
  const [currentCampaigns, setCurrentCampaigns] = useState<
    CampaignDocData[] | null
  >(null);

  const getCurrentCampaigns = async () => {
    try {
      const campaignCollectionRef = collection(firestore, "/campaigns");

      const q = query(campaignCollectionRef, orderBy("creationTs", "desc"));

      const queryResult = await getDocs(q);

      setCurrentCampaigns(
        queryResult.docs.map((d) => d.data() as CampaignDocData)
      );
    } catch (error) {
      console.log("getCurrentCampaigns error", error);
    }
  };

  useEffect(() => {
    getCurrentCampaigns();
  }, []);

  if (currentCampaigns === null)
    return (
      <div className="flex justify-center">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {currentCampaigns.map((campaign, i) => (
        <CampaignCard
          priceOffer={campaign.priceOffer}
          sector={campaign.sector}
          title={campaign.title}
          id={campaign.id}
          key={i}
        />
      ))}
    </div>
  );
}
