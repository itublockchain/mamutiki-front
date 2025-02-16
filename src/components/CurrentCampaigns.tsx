import { useAptosClient } from "@/helpers/useAptosClient";
import { GetCampaignFunctionResponse } from "@/types/Contract";
import { Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import { CampaignCard } from "./CampaignCard";

export function CurrentCampaigns() {
  const [currentCampaigns, setCurrentCampaigns] = useState<
    GetCampaignFunctionResponse[] | null
  >(null);

  const [isLoading, setIsLoading] = useState(false);

  const { getAllCampaigns, isAptosClientReady } = useAptosClient();

  const getInitialCampaings = async () => {
    if (isLoading) return;

    setIsLoading(true);

    const campaings = await getAllCampaigns();
    if (!campaings) {
      console.error("Error getting campaigns. See other logs.");
      setIsLoading(false);
      return setCurrentCampaigns(null);
    }

    setIsLoading(false);
    setCurrentCampaigns(campaings);
  };

  useEffect(() => {
    if (!isAptosClientReady) return;
    getInitialCampaings();
  }, [isAptosClientReady]);

  if (currentCampaigns === null)
    return (
      <div className="flex justify-center">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
        {currentCampaigns &&
          currentCampaigns.map((campaign, i) => (
            <CampaignCard
              id={campaign.id}
              staked={campaign.reward_pool}
              unitPrice={campaign.unit_price}
              title={campaign.title}
              key={i}
            />
          ))}
      </div>
    </div>
  );
}
