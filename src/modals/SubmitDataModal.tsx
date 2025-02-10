import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { useEffect, useState } from "react";

import { useAptosClient } from "@/helpers/useAptosClient";
import { GetCampaignFunctionResponse } from "@/types/Contract";
import { PinataSDK } from "pinata-web3";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  campaignData: GetCampaignFunctionResponse;
};

export function SubmitDataModal({ isOpen, setIsOpen, campaignData }: Props) {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isFileAnalyzeLoading, setIsFileAnalyzeLoading] = useState(false);

  const [analyzedDataLength, setAnalyzedDataLength] = useState<null | number>(
    null
  );
  const [analyzedDataQuality, setAnalyzedDataQuality] = useState<null | number>(
    null
  );

  const [isRequirementsMatched, setIsRequirementsMatched] = useState(false);

  const [uploadedDataCID, setUploadedDataCID] = useState("");

  const [possibleEarnedTokens, setPossibleEarnedTokens] = useState(0);

  const [isThereEnoughStaked, setIsThereEnoughStaked] = useState<
    null | boolean
  >(null);

  const { addContribution } = useAptosClient();

  // Clearing States Initially
  useEffect(() => {
    setAnalyzedDataLength(null);
    setAnalyzedDataQuality(null);
    setIsFileAnalyzeLoading(false);
    setIsSubmitLoading(false);
    setUploadedDataCID("");
  }, []);

  // Managing setIsRequirementsMatched states
  useEffect(() => {
    if (analyzedDataLength === null || analyzedDataQuality === null)
      return setIsRequirementsMatched(false);

    if (analyzedDataLength >= 0 && analyzedDataQuality >= 0) {
      setIsRequirementsMatched(true);
    } else {
      setIsRequirementsMatched(false);
    }
  }, [analyzedDataLength, analyzedDataQuality, isFileAnalyzeLoading]);

  // Managing possibleEarnedTokens
  useEffect(() => {
    if (analyzedDataLength === null || analyzedDataQuality === null)
      return setPossibleEarnedTokens(0);

    setPossibleEarnedTokens(analyzedDataLength * campaignData.unit_price);
  }, [campaignData, analyzedDataLength, analyzedDataQuality]);

  // Managing isThereEnoughStaked
  useEffect(() => {
    if (!campaignData || !possibleEarnedTokens)
      return setIsThereEnoughStaked(null);

    setIsThereEnoughStaked(
      campaignData.remaining_reward >= possibleEarnedTokens
    );
  }, [campaignData, possibleEarnedTokens]);

  const handleCancelButton = () => {
    setIsOpen(false);
  };

  const handleOnFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files === null) return;

    const file = e.target.files[0];
    if (!file) return;

    setIsFileAnalyzeLoading(true);

    // Initializing Pinata
    const pinata = new PinataSDK({
      pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
      pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
    });

    // Uploading Data to IPFS
    let fileCID = "";
    try {
      const upload = (await pinata.upload.file(file)) as {
        IpfsHash: string;
        PinSize: number;
        Timestamp: string;
      };

      fileCID = upload.IpfsHash;
    } catch (error) {
      return setIsFileAnalyzeLoading(false);
    }

    // Resetting Analyzting States
    setAnalyzedDataLength(null);
    setAnalyzedDataQuality(null);

    // Analyzing Data with help of AI
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {},
        body: JSON.stringify({
          fileCID: fileCID,
        }),
      });

      if (!response.ok) {
        console.error("Error:", await response.text());
        return setIsFileAnalyzeLoading(false);
      }

      const data = await response.json();

      const contentLength = data.length;
      const qualityScore = data.score;

      // Update States
      setAnalyzedDataLength(contentLength);
      setAnalyzedDataQuality(qualityScore);
      setUploadedDataCID(fileCID);
      setIsFileAnalyzeLoading(false);
    } catch (error) {
      console.error("Error on AI analyzing: ", error);
      return setIsFileAnalyzeLoading(false);
    }
  };

  const handleSubmitButton = async () => {
    if (!isRequirementsMatched) return;
    if (isFileAnalyzeLoading || isSubmitLoading) return;

    if (!analyzedDataLength || !analyzedDataQuality || !possibleEarnedTokens)
      return;

    if (!isThereEnoughStaked) return;

    setIsSubmitLoading(true)

    const response = await addContribution({
      campaignId: campaignData.id,
      data: uploadedDataCID,
      dataCount: analyzedDataLength,
      verified: true,
    });

    if (!response) {
      console.error("Error on submitting data: ", response);
      return setIsSubmitLoading(false);
    }

    // After successful sumbit...
    setIsSubmitLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleCancelButton}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Submit Data</ModalHeader>
          <ModalBody>
            <div id="campaign-limitaitons" className="flex flex-col gap-1">
              <div className="text-default-500 text-xs underline">
                Minimum Requirements
              </div>
              <div id="quality-requirement" className="flex gap-1 text-small ">
                <div className="text-default-500">Quality: </div>
                <div className="text-sm font-bold">0</div>
              </div>
              <div id="length-requirement" className="flex gap-1 text-small ">
                <div className="text-default-500">Length: </div>
                <div className="text-sm font-bold">0</div>
              </div>

              <div id="unit-price" className="flex gap-1 text-small ">
                <div className="text-default-500">Unit Price: </div>
                <div className="text-sm font-bold">
                  {campaignData.unit_price}
                </div>
              </div>
            </div>

            <div id="disclaimer" className=" text-small">
              Please submit your data to make its analyzation start.
            </div>
            <Input
              type="file"
              onChange={handleOnFileInputChange}
              isDisabled={isFileAnalyzeLoading || isSubmitLoading}
              isRequired
            />

            <div id="analyzation-result" className="flex flex-col">
              <div
                id="title"
                className="text-medium text-default-500 underline"
              >
                Analyzation Results
              </div>

              {isFileAnalyzeLoading && <Spinner color="current" />}

              {!isFileAnalyzeLoading && (
                <>
                  <div id="length" className="mt-1 flex gap-1 text-small ">
                    <div className="text-default-500">Length: </div>
                    <div className="text-sm font-bold">
                      {analyzedDataLength === null
                        ? "Waiting for data."
                        : analyzedDataLength + " Words"}
                    </div>
                  </div>

                  <div id="quality" className="flex gap-1 text-small ">
                    <div className="text-default-500">Quality: </div>
                    <div className="text-sm font-bold">
                      {analyzedDataQuality === null
                        ? "Waiting for data."
                        : analyzedDataQuality + "%"}
                    </div>
                  </div>

                  <div
                    id="possible-earned-tokens"
                    className="flex gap-1 text-small "
                  >
                    <div className="text-default-500">
                      Possible Earned Tokens:{" "}
                    </div>
                    <div className="text-sm font-bold">
                      {possibleEarnedTokens === 0
                        ? "Waiting for data."
                        : possibleEarnedTokens}
                    </div>
                  </div>

                  <div
                    id="is-there-enough-staked"
                    className="flex gap-1 text-small"
                  >
                    <div className="text-default-500">
                      Is There Enough Staked
                    </div>

                    <div className="text-sm font-bold">
                      {isThereEnoughStaked === null
                        ? "Waiting for data."
                        : isThereEnoughStaked
                        ? "Yes"
                        : "No"}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              variant="light"
              onPress={handleCancelButton}
              isDisabled={isSubmitLoading || isFileAnalyzeLoading}
            >
              Close
            </Button>
            <Button
              color="primary"
              onPress={handleSubmitButton}
              isLoading={isSubmitLoading || isFileAnalyzeLoading}
              isDisabled={
                isSubmitLoading ||
                isFileAnalyzeLoading ||
                !isRequirementsMatched ||
                !isThereEnoughStaked
              }
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
