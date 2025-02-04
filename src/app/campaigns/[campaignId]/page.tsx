"use client";

import { firestore } from "@/firebase/clientApp";
import { CampaignDocData } from "@/types/Campaign";
import { Image, Spinner } from "@heroui/react";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [campaignData, setCampaignData] = useState<
    CampaignDocData | null | "not-exist"
  >(null);

  const { campaignId: id } = useParams();

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
    <div className="flex flex-col w-full h-full justify-center items-center gap-10">
      <div
        id="creator-data"
        className="flex flex-col justify-center items-center gap-3"
      >
        <Image
          src="https://picsum.photos/200?random=1"
          className=" rounded-full w-32 h-32"
        />
        <div>User Id</div>
        <h1 className="text-2xl">{campaignData.creatorId}</h1>
      </div>
      <h1 className="text-2xl">{campaignData.title}</h1>
      <p className="text-lg">{campaignData.description}</p>
    </div>
  );
}
