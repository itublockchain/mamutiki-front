"use client";

import { SubmittedDatasSection } from "@/components/SubmittedDatasSection";
import { useAptosClient } from "@/helpers/useAptosClient";
import { SubmitDataModal } from "@/modals/SubmitDataModal";
import { GetCampaignFunctionResponse } from "@/types/Contract";
import { Button, Image, Spinner } from "@heroui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [campaignData, setCampaignData] = useState<
    GetCampaignFunctionResponse | null | "not-exist"
  >(null);

  const { campaignId: id } = useParams();

  const [isSubmitDataModalOpen, setIsSubmitDataModalOpen] = useState(false);

  const { getCampaignData, isAptosClientReady } = useAptosClient();

  useEffect(() => {
    if (!isAptosClientReady || !id) return;

    getInitialCampaignData();
  }, [isAptosClientReady, id]);

  const getInitialCampaignData = async () => {
    if (typeof id !== "string") {
      setCampaignData("not-exist");
      return console.error("Invalid campaign id");
    }

    const campaignData = await getCampaignData(id);
    if (!campaignData) {
      setCampaignData("not-exist");
      return console.error("Error getting campaign data");
    }

    setCampaignData(campaignData);
  };

  const handleSubmitButton = () => {
    setIsSubmitDataModalOpen(true);
  };

  if (campaignData === null)
    return (
      <div className="flex w-full h-full justify-center items-center">
        <Spinner size="lg" />
      </div>
    );

  if (campaignData === "not-exist")
    return (
      <div className="flex w-full h-full justify-center items-center">
        <h1 className="text-2xl">Campaign not found</h1>
      </div>
    );

  return (
    <>
      <div className="flex flex-col w-full h-full gap-10 px-10 py-5">
        <div
          id="creator-data"
          className="flex flex-col justify-center items-center gap-3"
        >
          <Image
            src="https://picsum.photos/200?random=1"
            className=" rounded-full w-32 h-32"
          />
          <div className="flex flex-col gap-1">
            <div className="text-xs">Campaign Creator</div>
            <h1 className="font-bold">{campaignData.creator}</h1>
          </div>
        </div>

        <div id="campaign-details" className="grid grid-cols-2 gap-3 w-full">
          <div id="campaign-name" className="flex flex-col gap-1">
            <div className="text-xs">Title</div>
            <h1 className="font-bold">{campaignData.title}</h1>
          </div>
          <div id="campaign-description" className="flex flex-col gap-1">
            <div className="text-xs">Description</div>
            <h1 className="font-bold">{campaignData.description}</h1>
          </div>

          <div id="campaign-price-offer" className="flex flex-col gap-1">
            <div className="text-xs">Unit Price</div>
            <h1 className="font-bold">{campaignData.unit_price}</h1>
          </div>
          <div id="campaign-offer-currency" className="flex flex-col gap-1">
            <div className="text-xs">Campaign Offer Currency</div>
            <h1 className="font-bold">APT</h1>
          </div>

          <div id="campaign-total-staked" className="flex flex-col gap-1">
            <div className="text-xs">Initial Statked</div>
            <h1 className="font-bold">{campaignData.reward_pool}</h1>
          </div>

          <div id="campaign-remaining-statked" className="flex flex-col gap-1">
            <div className="text-xs">Remaining Staked</div>
            <h1 className="font-bold">{campaignData.remaining_reward}</h1>
          </div>

          <div id="campaign-min-data-quality" className="flex flex-col gap-1">
            <div className="text-xs">Campaign Min Data Quality</div>
            <h1 className="font-bold">{campaignData.data_spec}</h1>
          </div>

          <div id="campaign-status" className="flex flex-col gap-1">
            <div className="text-xs">Campaign Status</div>
            <h1 className="font-bold">{campaignData.active.toString()}</h1>
          </div>
        </div>

        <div
          id="submit-data-root"
          className="flex flex-col w-full items-center"
        >
          <Button onPress={handleSubmitButton}>Submit Data</Button>
        </div>

        <SubmittedDatasSection
          campaignId={campaignData.id}
          campaignDocData={campaignData}
        />
      </div>

      <SubmitDataModal
        isOpen={isSubmitDataModalOpen}
        setIsOpen={setIsSubmitDataModalOpen}
        campaignData={campaignData}
      />
    </>
  );
}
