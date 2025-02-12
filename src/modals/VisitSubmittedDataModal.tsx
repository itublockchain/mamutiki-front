import { SubmittedDataDocData } from "@/types/SubmitData";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  submittedDataDocData: SubmittedDataDocData;
};

export function VisitSubmittedDataModal({
  isOpen,
  setIsOpen,
  submittedDataDocData,
}: Props) {
  const handleCancelButton = () => {
    setIsOpen(false);
  };

  const [isDownloadLoading, setIsDownloadLoading] = useState(false);

  const { signMessage, account } = useWallet();

  const handleDownloadButton = async () => {
    setIsDownloadLoading(true);

    const signData = await createSignedMessage();
    if (!signData) {
      console.error("Error: Failed to create signData");
      return setIsDownloadLoading(false);
    }

    const response = await sendGetDataRequest(signData);
    if (!response) {
      console.error("Error: Failed to get data");
      return setIsDownloadLoading(false);
    }

    const cleanedData = cleanData(response);
    if (!cleanedData) {
      console.error("Error: Failed to clean data");
      return setIsDownloadLoading(false);
    }

    const downloadResult = downloadData(cleanedData);
    if (!downloadResult) {
      console.error("Error: Failed to download data");
      return setIsDownloadLoading(false);
    }

    setIsDownloadLoading(false);
    setIsOpen(false);
  };

  const createSignedMessage = async () => {
    const nonce = Math.random().toString(36).substring(2, 15);
    const message =
      "Please sign this message to access the data. \n(Nonce: " + nonce + ")";

    try {
      const response = await signMessage({
        message,
        nonce: nonce,
      });

      const signature = response.signature.toString();
      const fullMessage = response.fullMessage;

      return {
        signature: signature,
        fullMessage: fullMessage,
      };
    } catch (error) {
      console.error("Error: Failed to sign message: ", error);
      return false;
    }
  };

  const sendGetDataRequest = async (signData: {
    signature: string;
    fullMessage: string;
  }) => {
    if (!account) return false;

    try {
      const response = await fetch("/api/getData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicKey: account.publicKey,
          signature: signData.signature,
          fullMessage: signData.fullMessage,
          campaignId: submittedDataDocData.campaignId,
        }),
      });

      if (!response.ok) {
        console.error("Error: Failed to get data", await response.text());
        return false;
      }

      const result = (await response.json()) as { data: string };

      return result.data;
    } catch (error) {
      console.error("Error: Failed to get data", error);
      return false;
    }
  };

  const cleanData = (data: string) => {
    try {
      const cleanedJSON = JSON.parse(JSON.parse(data)) as JSON;
      return JSON.stringify(cleanedJSON);
    } catch (error) {
      console.error("Error: Failed to clean data", error);
      return false;
    }
  };

  const downloadData = (data: string) => {
    try {
      // Create a Blob with the JSON data
      const blob = new Blob([data], { type: "application/json" });

      // Create a temporary URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.json"; // Set the filename

      // Trigger the download
      document.body.appendChild(a);
      a.click();

      // Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error("Error: Failed to download data", error);
      return false;
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={handleCancelButton}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Download Submitted Data
          </ModalHeader>
          <ModalBody>
            <div id="data-submitter" className="flex flex-col">
              <div id="name" className="text-default-500 text-xs">
                Submitter ID
              </div>
              <div id="id" className="text-sm">
                {submittedDataDocData.creatorId}
              </div>
            </div>

            <div id="data-date" className="flex flex-col">
              <div id="name" className="text-default-500 text-xs">
                Date
              </div>
              <div id="id" className="text-sm">
                {new Date(submittedDataDocData.creationTs).toDateString()}
              </div>
            </div>

            <div id="data-quality" className="flex flex-col">
              <div id="name" className="text-default-500 text-xs">
                Quality
              </div>
              <div id="id" className="text-sm">
                {submittedDataDocData.dataQuality}
              </div>
            </div>

            <div id="data-length" className="flex flex-col">
              <div id="name" className="text-default-500 text-xs">
                Token Length
              </div>
              <div id="id" className="text-sm">
                {submittedDataDocData.dataLength}
              </div>
            </div>

            <div id="data-id" className="flex flex-col">
              <div id="name" className="text-default-500 text-xs">
                Data ID
              </div>
              <div id="id" className="text-sm">
                {submittedDataDocData.id}
              </div>
            </div>

            <div id="data-possible-cost" className="flex flex-col">
              <div id="name" className="text-default-500 text-xs">
                Possible Cost
              </div>
              <div id="id" className="text-sm">
                {submittedDataDocData.id}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={handleCancelButton}>
              Close
            </Button>
            <Button
              color="primary"
              onPress={handleDownloadButton}
              isLoading={isDownloadLoading}
            >
              Download
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
