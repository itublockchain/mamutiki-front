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
import { AIAnalysisResponse } from "@/types/API";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  campaignData: GetCampaignFunctionResponse;
};

export function SubmitDataModal({ isOpen, setIsOpen, campaignData }: Props) {
  const [isFileAnalyzeLoading, setIsFileAnalyzeLoading] = useState(false);

  const [aiAnalysis, setAIAnalysis] = useState<null | AIAnalysisResponse>(null);

  const [isRequirementsMatched, setIsRequirementsMatched] = useState(false);

  const [possibleEarnedTokens, setPossibleEarnedTokens] = useState(0);

  const [isThereEnoughStaked, setIsThereEnoughStaked] = useState<
    null | boolean
  >(null);

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const { addContribution } = useAptosClient();

  // Clearing States Initially
  useEffect(() => {
    setIsFileAnalyzeLoading(false);
    setIsSubmitLoading(false);
    setAIAnalysis(null);
  }, []);

  // Managing setIsRequirementsMatched states
  useEffect(() => {
    if (!aiAnalysis) return setIsRequirementsMatched(false);

    if (aiAnalysis.score >= 0 && aiAnalysis.contentLength >= 0) {
      setIsRequirementsMatched(true);
    } else {
      setIsRequirementsMatched(false);
    }
  }, [aiAnalysis, isFileAnalyzeLoading]);

  // Managing possibleEarnedTokens
  useEffect(() => {
    if (!aiAnalysis) return setPossibleEarnedTokens(0);

    setPossibleEarnedTokens(aiAnalysis.contentLength * campaignData.unit_price);
  }, [campaignData, aiAnalysis]);

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

    // Sending Analyzation Request
    try {
      const formData = new FormData();

      formData.append("campaignId", campaignData.id.toString());
      formData.append("file", file);

      const response = await fetch("/api/ai", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          "Response is not okay from API: " + (await response.text())
        );
      }

      const data = (await response.json()) as AIAnalysisResponse;

      setAIAnalysis(data);
    } catch (error) {
      console.error("Error on analyzing file: ", error);
    }

    setIsFileAnalyzeLoading(false);
  };

  const handleSubmitButton = async () => {
    if (!isRequirementsMatched) return;
    if (isFileAnalyzeLoading || isSubmitLoading) return;

    if (!aiAnalysis || !possibleEarnedTokens) return;

    if (!isThereEnoughStaked) return;

    setIsSubmitLoading(true);

    const response = await addContribution({
      campaignId: campaignData.id,
      dataCount: aiAnalysis.contentLength,
      store_key: aiAnalysis.ipfsCID,
      score: aiAnalysis.score.toString(),
      sign: aiAnalysis.signature,
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
                      {aiAnalysis === null
                        ? "Waiting for data."
                        : aiAnalysis.contentLength + " Words"}
                    </div>
                  </div>

                  <div id="quality" className="flex gap-1 text-small ">
                    <div className="text-default-500">Quality: </div>
                    <div className="text-sm font-bold">
                      {aiAnalysis === null
                        ? "Waiting for data."
                        : aiAnalysis.score + "%"}
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
