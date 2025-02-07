import { firestore } from "@/firebase/clientApp";
import { SubmittedDataDocData } from "@/types/SubmitData";
import { Spinner } from "@heroui/react";
import { collection, query, orderBy, where, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { SubmittedDataPreviewCard } from "./SubmittedDataPreviewCard";
import { CampaignDocData } from "@/types/Campaign";

type Props = {
  campaignId: string;
  campaignDocData: CampaignDocData;
};

export function SubmittedDatasSection({ campaignId, campaignDocData }: Props) {
  const [submittedDatas, setSubmittedDatas] = useState<
    SubmittedDataDocData[] | null
  >(null);

  const getSubmittedDatas = async () => {
    try {
      const submittedDatasCollection = collection(firestore, "/submittedDatas");

      const q = query(
        submittedDatasCollection,
        orderBy("creationTs", "desc"),
        where("campaignId", "==", campaignId)
      );

      const queryResult = await getDocs(q);

      setSubmittedDatas(
        queryResult.docs.map((d) => d.data() as SubmittedDataDocData)
      );
    } catch (error) {
      console.log("getSubmittedDatas error", error);
      setSubmittedDatas(null);
    }
  };

  useEffect(() => {
    if (campaignId) getSubmittedDatas();
  }, [campaignId]);

  if (!submittedDatas)
    return (
      <div className="flex w-full h-full justify-center items-center">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="grid grid-cols-2 gap-5">
      {submittedDatas.map((d) => (
        <SubmittedDataPreviewCard
          submittedData={d}
          key={d.id}
          campaignDocData={campaignDocData}
        />
      ))}
    </div>
  );
}
