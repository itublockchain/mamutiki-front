import { useAptosClient } from "@/helpers/useAptosClient";
import { Contribution, GetCampaignFunctionResponse } from "@/types/Contract";
import { Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import { SubmittedDataPreviewCard } from "./SubmittedDataPreviewCard";

type Props = {
  campaignId: number;
  campaignDocData: GetCampaignFunctionResponse;
};

export function SubmittedDatasSection({ campaignId, campaignDocData }: Props) {
  const [submittedDatas, setSubmittedDatas] = useState<Contribution[] | null>(
    null
  );

  const { isAptosClientReady, getContributions } = useAptosClient();

  const getSubmittedDatas = async () => {
    if (!isAptosClientReady || !campaignId) return setSubmittedDatas(null);

    const contributions = await getContributions(campaignId.toString());
    if (!contributions) return setSubmittedDatas(null);

    setSubmittedDatas(contributions);
  };

  useEffect(() => {
    if (campaignId && isAptosClientReady) getSubmittedDatas();
  }, [campaignId, isAptosClientReady]);

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
          key={d.storeCid}
          campaignDocData={campaignDocData}
        />
      ))}
    </div>
  );
}
