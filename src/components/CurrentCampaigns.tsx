import { useAptosClient } from "@/helpers/useAptosClient";
import { GetCampaignFunctionResponse } from "@/types/Contract";
import { Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import CampaignCard from "./CampaignCard";

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

  return (
    <div id="active-campaigns-root" className="flex flex-col gap-5">
      <div id="title" className="text-2xl font-bold">
        Active Campaigns
      </div>
      {isLoading || currentCampaigns === null ? (
        <div className="flex w-full">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-10">
          {currentCampaigns.map((campaign) => (
            <CampaignCard
              id={campaign.id}
              staked={campaign.reward_pool}
              unitPrice={campaign.unit_price}
              title={campaign.title}
              campaigner={campaign.creator}
              remainingStakes={campaign.remaining_reward}
              description={campaign.description}
              key={campaign.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
