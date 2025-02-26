import { useAptosClient } from "@/helpers/useAptosClient";
import { Contribution, GetCampaignFunctionResponse } from "@/types/Contract";
import {
  getKeyValue,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useEffect, useState } from "react";

import { VisitSubmittedDataModal } from "@/modals/VisitSubmittedDataModal";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";

type Props = {
  campaignId: number;
  campaignDocData: GetCampaignFunctionResponse;
};

export function SubmittedDatasSection({ campaignId }: Props) {
  const [submittedDatas, setSubmittedDatas] = useState<Contribution[] | null>(
    null
  );

  const { isAptosClientReady, getContributions } = useAptosClient();

  const [isVisitSubmittedDataModalOpen, setIsVisitSubmittedDataModalOpen] =
    useState(false);

  const [submittedDataDocDataIndex, setSubmittedDataDocDataIndex] = useState(0);

  useEffect(() => {
    if (campaignId && isAptosClientReady) getSubmittedDatas();
  }, [campaignId, isAptosClientReady]);

  const getSubmittedDatas = async () => {
    if (!isAptosClientReady || !campaignId) return setSubmittedDatas(null);

    const contributions = await getContributions(campaignId.toString());
    if (!contributions) return setSubmittedDatas(null);

    setSubmittedDatas(contributions);
  };

  const handleVisitSubmittedData = (index: number) => {
    setSubmittedDataDocDataIndex(index);
    setIsVisitSubmittedDataModalOpen(true);
  };

  if (!submittedDatas)
    return (
      <div className="flex w-full h-full justify-center items-center">
        <Spinner size="lg" />
      </div>
    );

  return (
    <>
      <Table removeWrapper>
        <TableHeader
          columns={[
            {
              key: "address",
              label: "Address",
            },
            {
              key: "share",
              label: "Share",
            },

            {
              key: "aiScore",
              label: "AI Score",
            },

            {
              key: "dataAmount",
              label: "Data Amount",
            },
            {
              key: "action",
              label: "Action",
            },
          ]}
        >
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>

        <TableBody
          items={submittedDatas.map((item, index) => ({
            key: index,
            address:
              item.contributor.slice(0, 4) + "..." + item.contributor.slice(-7),
            share: "20%",
            aiScore: item.score,
            dataAmount: item.dataCount,
            action: (
              <ArrowsRightLeftIcon
                className="w-5 cursor-pointer"
                onClick={() => {
                  handleVisitSubmittedData(index);
                }}
              />
            ),
          }))}
        >
          {(item) => (
            <TableRow
              key={item.key}
              className="border-b border-primary/30 cursor-pointer"
              onClick={() => handleVisitSubmittedData(item.key)}
            >
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <VisitSubmittedDataModal
        isOpen={isVisitSubmittedDataModalOpen}
        setIsOpen={setIsVisitSubmittedDataModalOpen}
        submittedDataDocData={submittedDatas[submittedDataDocDataIndex]}
      />
    </>
  );
}
