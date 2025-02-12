import { GetCampaignFunctionResponse } from "@/types/Contract";
import { SubmittedDataDocData } from "@/types/SubmitData";
import { Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import { SubmittedDataPreviewCard } from "./SubmittedDataPreviewCard";

type Props = {
  campaignId: number;
  campaignDocData: GetCampaignFunctionResponse;
};

export function SubmittedDatasSection({ campaignId, campaignDocData }: Props) {
  const [submittedDatas, setSubmittedDatas] = useState<
    SubmittedDataDocData[] | null
  >(null);

  const getSubmittedDatas = async () => {
    setSubmittedDatas([
      {
        campaignId: campaignId.toString(),
        creatorId: "01",
        creationTs: Date.now(),
        dataCID: "bafkreiddxkswhgwxh4sbu63ikqfya7qsusgczwyvga5nvbibigtqwdbywe",
        dataLength: 10,
        dataQuality: 90,
        earnedTokens: 1,
        id: "ID-153",
        sector: "data",
      },
    ]);
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
