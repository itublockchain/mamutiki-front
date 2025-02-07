import { SubmittedDataDocData } from "@/types/SubmitData";
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

  const handleDownloadButton = async () => {
    const fileURL =
      process.env.NEXT_PUBLIC_IPFS_SUFFIX + "/" + submittedDataDocData.dataCID;
    setIsDownloadLoading(true);

    try {
      const response = await fetch(fileURL);
      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = submittedDataDocData.dataCID;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setIsDownloadLoading(false);
      setIsOpen(false);
    } catch (error) {
      console.error("Error downloading the file:", error);
      setIsDownloadLoading(false);
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
