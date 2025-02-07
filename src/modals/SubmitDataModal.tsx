import { CampaignDocData } from "@/types/Campaign";
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

import { auth, firestore } from "@/firebase/clientApp";
import { SubmittedDataDocData } from "@/types/SubmitData";
import { SubmitterDocData } from "@/types/Submitter";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { PinataSDK } from "pinata-web3";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  campaignData: CampaignDocData;
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

    if (
      analyzedDataLength >= campaignData.minDataQuantity &&
      analyzedDataQuality >= campaignData.minDataQuality
    ) {
      setIsRequirementsMatched(true);
    } else {
      setIsRequirementsMatched(false);
    }
  }, [analyzedDataLength, analyzedDataQuality, isFileAnalyzeLoading]);

  // Managing possibleEarnedTokens
  useEffect(() => {
    if (analyzedDataLength === null || analyzedDataQuality === null)
      return setPossibleEarnedTokens(0);

    setPossibleEarnedTokens(
      analyzedDataLength * analyzedDataQuality * campaignData.unitPrice
    );
  }, [campaignData, analyzedDataLength, analyzedDataQuality]);

  // Managing isThereEnoughStaked
  useEffect(() => {
    if (!campaignData || !possibleEarnedTokens)
      return setIsThereEnoughStaked(null);

    setIsThereEnoughStaked(
      campaignData.remainingStatkedBalance >= possibleEarnedTokens
    );
  }, [campaignData, possibleEarnedTokens]);

  const handleCancelButton = () => {
    setIsOpen(false);
  };

  const handleSubmitButton = async () => {
    if (!isRequirementsMatched) return;
    if (isFileAnalyzeLoading || isSubmitLoading) return;

    if (!analyzedDataLength || !analyzedDataQuality || !possibleEarnedTokens)
      return;

    if (!isThereEnoughStaked) return;

    const currentUserId = auth.currentUser?.uid || "";
    if (!currentUserId) {
      console.error("Error: User not logged in.");
    }

    // Creating Submit Doc at Firebase
    const currentUserDisplayName = auth.currentUser?.uid || "";
    if (!currentUserDisplayName) {
      return console.error("Error: User not logged in.");
    }

    setIsSubmitLoading(true);

    const data: SubmittedDataDocData = {
      campaignId: campaignData.id,
      creationTs: Date.now(),
      creatorId: currentUserDisplayName,
      dataCID: uploadedDataCID,
      dataLength: analyzedDataLength,
      dataQuality: analyzedDataQuality,
      id: "", // will be updated.
      sector: campaignData.sector,
      earnedTokens: possibleEarnedTokens,
    };

    try {
      const submittedDatasCollection = collection(firestore, "/submittedDatas");

      const addDocResult = await addDoc(submittedDatasCollection, data);

      // Updating "id" part
      const newDoc = doc(firestore, addDocResult.path);
      await updateDoc(newDoc, {
        id: addDocResult.id,
      });

      // Done!
    } catch (error) {
      console.error("Error on creating submit data: ", error);
      return setIsSubmitLoading(false);
    }

    // Updating or setting "submitter" doc
    try {
      const submitterDocRef = doc(firestore, `submitters/${currentUserId}`);

      let doesExist = false;

      // Look if it exist...
      const optionalExistedDoc = await getDoc(submitterDocRef);

      doesExist = optionalExistedDoc.exists();

      if (doesExist) {
        const oldData = optionalExistedDoc.data() as SubmitterDocData;

        await updateDoc(submitterDocRef, {
          totalSubmittedDataCount: increment(1),
          totalSubmitterDataLength: increment(analyzedDataLength),
          totalDataQualityScore: increment(analyzedDataQuality),
          averageDataQualityScore:
            (oldData.totalDataQualityScore + analyzedDataQuality) /
            (oldData.totalSubmittedDataCount + 1),
          totalEarned: increment(possibleEarnedTokens),
        });
      } else {
        const newData: SubmitterDocData = {
          creationTs: Date.now(),
          id: currentUserId,
          totalSubmittedDataCount: 1,
          totalSubmitterDataLength: analyzedDataLength,
          totalDataQualityScore: analyzedDataQuality,
          averageDataQualityScore: analyzedDataQuality,
          totalEarned: possibleEarnedTokens,
        };
        await setDoc(submitterDocRef, newData);
      }
    } catch (error) {
      console.error("Error on updating submitter doc: ", error);
      return setIsSubmitLoading(false);
    }

    // Updating campaign doc
    try {
      const campaignDocRef = doc(firestore, `campaigns/${campaignData.id}`);

      await updateDoc(campaignDocRef, {
        submitCount: increment(1),
        remainingStatkedBalance: increment(-possibleEarnedTokens),
      });
    } catch (error) {
      console.error("Error on updating campaign doc: ", error);
      return setIsSubmitLoading(false);
    }

    // Update campaigner doc
    try {
      const campaignerDocRef = doc(
        firestore,
        `campaigners/${campaignData.creatorId}`
      );

      await updateDoc(campaignerDocRef, {
        totalSpent: increment(possibleEarnedTokens),
      });
    } catch (error) {
      console.error("Error on updating campaigner doc: ", error);
      return setIsSubmitLoading(false);
    }

    // After successful sumbit...
    setIsSubmitLoading(false);
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
                <div className="text-sm font-bold">
                  {campaignData.minDataQuality}
                </div>
              </div>
              <div id="length-requirement" className="flex gap-1 text-small ">
                <div className="text-default-500">Length: </div>
                <div className="text-sm font-bold">
                  {campaignData.minDataQuantity}
                </div>
              </div>

              <div id="unit-price" className="flex gap-1 text-small ">
                <div className="text-default-500">Unit Price: </div>
                <div className="text-sm font-bold">
                  {campaignData.unitPrice}
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
