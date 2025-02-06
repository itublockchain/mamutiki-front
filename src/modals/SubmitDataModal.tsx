import { CampaignDocData } from "@/types/Campaign";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
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

  const handleCancelButton = () => {
    setIsOpen(false);
  };

  const handleSubmitButton = async () => {
    if (!isRequirementsMatched) return;
    if (isFileAnalyzeLoading || isSubmitLoading) return;

    if (!analyzedDataLength || !analyzedDataQuality) return;

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
      status: "pending",
      id: "", // will be updated.
      sector: campaignData.sector,
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
        });
      } else {
        const newData: SubmitterDocData = {
          creationTs: Date.now(),
          id: currentUserId,
          totalSubmittedDataCount: 1,
          totalSubmitterDataLength: analyzedDataLength,
          totalDataQualityScore: analyzedDataQuality,
          averageDataQualityScore: analyzedDataQuality,
        };
        await setDoc(submitterDocRef, newData);
      }
    } catch (error) {
      console.error("Error on updating submitter doc: ", error);
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
    if (analyzedDataLength === null || analyzedDataQuality === null) return;

    if (
      analyzedDataLength >= campaignData.minDataQuantity &&
      analyzedDataQuality >= campaignData.minDataQuality
    ) {
      setIsRequirementsMatched(true);
    } else {
      setIsRequirementsMatched(false);
    }
  }, [analyzedDataLength, analyzedDataQuality, isFileAnalyzeLoading]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleCancelButton}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Submit Data</ModalHeader>
          <ModalBody>
            <div id="message" className="flex flex-col gap-3">
              <div className="text-xs text-warning-500">
                You need to submit data satisfies these requirements:{" "}
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-xs">Campaign Min Data Quality</div>
                <h1 className="font-bold">{campaignData.minDataQuality}</h1>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-xs">Campaign Min Data Quantity</div>
                <h1 className="font-bold">{campaignData.minDataQuantity}</h1>
              </div>
              <div className="text-xs text-warning-500">
                Your data will be started to analyze after uploading for if it
                satisfies these requirements.
              </div>

              <Input
                type="file"
                accept=".json"
                onChange={handleOnFileInputChange}
              />

              <div className="flex flex-col gap-1">
                <div className="text-xs">Analyzed Data Length</div>
                <h1 className="font-bold">
                  {analyzedDataLength === null
                    ? "Not Analyzed"
                    : analyzedDataLength}
                </h1>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-xs">Analyzed Data Quality</div>
                <h1 className="font-bold">
                  {analyzedDataQuality === null
                    ? "Not Analyzed"
                    : analyzedDataQuality}
                </h1>
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-xs">Requirements Matched</div>
                <h1 className="font-bold">
                  {isRequirementsMatched ? "Yes" : "No"}
                </h1>
              </div>
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
                !isRequirementsMatched
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
