"use client";

import CreateCampaignFloatingButton from "@/components/CreateCampaignFloatingButton";
import { SubmittedDatasSection } from "@/components/SubmittedDatasSection";
import { useAptosClient } from "@/helpers/useAptosClient";
import { ConnectWalletModal } from "@/modals/ConnectWalletModal";
import { SubmitDataModal } from "@/modals/SubmitDataModal";
import { GetCampaignFunctionResponse } from "@/types/Contract";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Spinner } from "@heroui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [campaignData, setCampaignData] = useState<
    GetCampaignFunctionResponse | null | "not-exist"
  >(null);

  const { campaignId: id } = useParams();

  const [isSubmitDataModalOpen, setIsSubmitDataModalOpen] = useState(false);

  const { getCampaignData, isAptosClientReady } = useAptosClient();

  const [diamondFullCount, setDiamondFullCount] = useState(0);

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const { account } = useWallet();

  useEffect(() => {
    if (!isAptosClientReady || !id) return;

    getInitialCampaignData();
  }, [isAptosClientReady, id]);

  useEffect(() => {
    if (!campaignData) return setDiamondFullCount(0);
    if (campaignData === "not-exist") return setDiamondFullCount(0);

    const fullD = Math.round(campaignData.minimumScore / 20);

    setDiamondFullCount(fullD);
  }, [campaignData]);

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
    if (!account) return setIsWalletModalOpen(true);

    setIsSubmitDataModalOpen(true);
  };

  if (campaignData === null)
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <Spinner size="lg" />
      </div>
    );

  if (campaignData === "not-exist")
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <h1 className="text-xl">Campaign not found</h1>
      </div>
    );

  return (
    <>
      <div
        id="campaign-detail-page-root"
        className="flex flex-col min-h-screen p-5 md:p-10 md:px-20 gap-8"
      >
        <div
          id="title-description-part"
          className="flex flex-col justify-center w-full gap-8"
        >
          <div id="title-and-tags" className="flex flex-col gap-2">
            <div id="title" className="text-3xl font-bold text-primary">
              {campaignData.title}
            </div>
            <div id="tags" className="flex flex-row gap-3">
              {["Health", "Finance"].map((tag) => (
                <div
                  id="tag-1"
                  className="flex items-center justify-center bg-white/30 px-2 py-0.5 rounded-xl text-sm"
                  key={tag}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>

          <div id="description" className="text-white text-sm">
            {campaignData.description}
          </div>
        </div>

        <div
          id="specs"
          className="flex flex-row flex-wrap md:flex-nowrap w-full justify-between"
        >
          <div
            id="unit-price-and-min-quality-part"
            className="flex flex-row gap-8"
          >
            <div id="unit-price" className="flex flex-col gap-0.5">
              <div id="label" className="text-gray-400 text-sm">
                Unit Price
              </div>
              <div id="value" className="text-white text-xl">
                {campaignData.unit_price} DATA
              </div>
            </div>

            <div id="minimum-quality-part" className="flex flex-col gap-1">
              <div id="label" className="text-gray-400 text-sm">
                Min Data Quality
              </div>
              <div
                id="value"
                className="flex flex-row justify-center items-center gap-1"
              >
                <div
                  id="numbered-quality"
                  className="hidden md:flex items-center justify-center mr-2"
                >
                  {campaignData.minimumScore}
                </div>
                {[...Array(diamondFullCount)].map((_, i) => (
                  <img src="/diamond_full.png" className="w-5" key={i} />
                ))}
                {[...Array(5 - diamondFullCount)].map((_, i) => (
                  <img src="/diamond_empty.png" className="w-5" key={i} />
                ))}
              </div>
            </div>
          </div>

          <div
            id="remaining-stake-and-initial-stake-parts"
            className="flex flex-row gap-8 pt-5 md:pt-0"
          >
            <div id="remaining-stake-part" className="flex flex-col gap-0.5">
              <div id="label" className="text-gray-400 text-sm">
                Remaining Staked
              </div>
              <div id="value" className="text-white text-xl">
                {campaignData.remaining_reward}
              </div>
            </div>

            <div id="initial-stake-part" className="flex flex-col gap-0.5">
              <div id="label" className="text-gray-400 text-sm">
                Initial Stake
              </div>
              <div id="value" className="text-white text-xl">
                {campaignData.reward_pool}
              </div>
            </div>
          </div>
        </div>

        <div
          id="creator-submit-part"
          className="flex flex-row w-full justify-between items-center"
        >
          <div id="creator-part" className="flex flex-col gap-2">
            <div
              id="created-at-part"
              className="flex flex-row gap-1 text-xs items-center"
            >
              <div id="label" className="text-gray-400">
                Created At
              </div>
              <div id="time" className="">
                {new Date(campaignData.createdAt * 1000).toLocaleDateString()}
              </div>
            </div>

            <div
              id="creator-info-part"
              className="flex flex-row gap-2 items-center text-sm"
            >
              <img
                src={`https://picsum.photos/seed/picsum/200/200?random=${campaignData.creator}`}
                className="w-7 h-7 rounded-full"
              />
              <div id="creator-name" className="text-gray-300">
                {campaignData.creator.slice(0, 4)}
                ......
                {campaignData.creator.slice(-7)}
              </div>
            </div>
          </div>

          <div
            id="button-part"
            className="flex items-center justify-center px-2 py-1.5 bg-primary rounded-lg cursor-pointer text-black font-bold text-sm"
            onClick={handleSubmitButton}
          >
            Submit Data
          </div>
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

      <ConnectWalletModal
        isOpen={isWalletModalOpen}
        setIsOpen={setIsWalletModalOpen}
      />

      <CreateCampaignFloatingButton />
    </>
  );
}
