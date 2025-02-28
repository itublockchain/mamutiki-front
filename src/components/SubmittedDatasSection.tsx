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
import { useWallet } from "@aptos-labs/wallet-adapter-react";

type Props = {
  campaignId: number;
  campaignDocData: GetCampaignFunctionResponse;
};

export function SubmittedDatasSection({ campaignId, campaignDocData }: Props) {
  const [submittedDatas, setSubmittedDatas] = useState<Contribution[] | null>(
    null
  );

  const { isAptosClientReady, getContributions } = useAptosClient();

  const [isVisitSubmittedDataModalOpen, setIsVisitSubmittedDataModalOpen] =
    useState(false);

  const [submittedDataDocDataIndex, setSubmittedDataDocDataIndex] = useState(0);

  const [isOwner, setIsOWner] = useState(false);
  const { account } = useWallet();

  useEffect(() => {
    if (campaignId && isAptosClientReady) getSubmittedDatas();
  }, [campaignId, isAptosClientReady]);

  useEffect(() => {
    if (!account) return setIsOWner(false);

    const connectedAccountAddress = account.address;

    setIsOWner(connectedAccountAddress === campaignDocData.creator);
  }, [account]);

  const getSubmittedDatas = async () => {
    if (!isAptosClientReady || !campaignId) return setSubmittedDatas(null);

    const contributions = await getContributions(campaignId.toString());
    if (!contributions) return setSubmittedDatas(null);

    setSubmittedDatas(contributions);
  };

  const handleVisitSubmittedData = (index: number) => {
    if (!isOwner) return;

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
    <div id="root" className="flex flex-col gap-3">
      <div id="label" className="flex text-gray-500">
        Submissions
      </div>

      <div id="table-container" className="flex overflow-auto">
        <Table removeWrapper>
          <TableHeader
            columns={[
              {
                key: "address",
                label: "Address",
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
                key: "reward",
                label: "Reward",
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
                item.contributor.slice(0, 4) +
                "..." +
                item.contributor.slice(-7),
              aiScore: item.score,
              dataAmount: item.dataCount,
              reward: (
                (item.score / 100) *
                item.dataCount *
                campaignDocData.unit_price
              ).toFixed(4),
              action: (
                <ArrowsRightLeftIcon
                  style={{
                    display: isOwner ? "unset" : "none",
                  }}
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
      </div>
    </div>
  );
}
