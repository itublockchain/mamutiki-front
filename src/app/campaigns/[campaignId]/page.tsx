"use client";

import { SubmittedDatasSection } from "@/components/SubmittedDatasSection";
import { firestore } from "@/firebase/clientApp";
import { SubmitDataModal } from "@/modals/SubmitDataModal";
import { CampaignDocData } from "@/types/Campaign";
import { Button, Card, CardBody, Image, Spinner } from "@heroui/react";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [campaignData, setCampaignData] = useState<
    CampaignDocData | null | "not-exist"
  >(null);

  const { campaignId: id } = useParams();

  const [isSubmitDataModalOpen, setIsSubmitDataModalOpen] = useState(false);

  useEffect(() => {
    getCampaignData();
  }, [id]);

  const getCampaignData = async () => {
    if (!id) setCampaignData(null);

    try {
      const docRef = doc(firestore, "/campaigns/" + id);

      const docSnapshot = await getDoc(docRef);

      if (!docSnapshot.exists) {
        return setCampaignData("not-exist");
      }

      const data = docSnapshot.data() as CampaignDocData;
      if (!data) {
        return setCampaignData("not-exist");
      }

      setCampaignData(data);
    } catch (error) {
      console.log("getCampaignData error", error);
      setCampaignData(null);
    }
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
      <div className="flex flex-col w-full h-full gap-10">
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
            <h1 className="font-bold">{campaignData.creatorId}</h1>
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
          <div id="campaign-sector" className="flex flex-col gap-1">
            <div className="text-xs">Sector</div>
            <h1 className="font-bold">{campaignData.sector}</h1>
          </div>
          <div id="campaign-price-offer" className="flex flex-col gap-1">
            <div className="text-xs">Unit Price</div>
            <h1 className="font-bold">{campaignData.unitPrice}</h1>
          </div>
          <div id="campaign-offer-currency" className="flex flex-col gap-1">
            <div className="text-xs">Campaign Offer Currency</div>
            <h1 className="font-bold">{campaignData.offerCurrency}</h1>
          </div>

          <div id="campaign-total-staked" className="flex flex-col gap-1">
            <div className="text-xs">Initial Statked</div>
            <h1 className="font-bold">{campaignData.stakedBalance}</h1>
          </div>

          <div id="campaign-remaining-statked" className="flex flex-col gap-1">
            <div className="text-xs">Remaining Staked</div>
            <h1 className="font-bold">
              {campaignData.remainingStatkedBalance}
            </h1>
          </div>

          <div id="campaign-min-data-quality" className="flex flex-col gap-1">
            <div className="text-xs">Campaign Min Data Quality</div>
            <h1 className="font-bold">{campaignData.minDataQuality}</h1>
          </div>
          <div id="campaign-min-data-quantity" className="flex flex-col gap-1">
            <div className="text-xs">Campaign Min Data Quantity</div>
            <h1 className="font-bold">{campaignData.minDataQuantity}</h1>
          </div>
          <div id="campaign-status" className="flex flex-col gap-1">
            <div className="text-xs">Campaign Status</div>
            <h1 className="font-bold">{campaignData.status}</h1>
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
