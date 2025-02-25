import { Contribution } from "@/types/Contract";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { createDecipheriv } from "crypto";
import { PinataSDK } from "pinata-web3";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  submittedDataDocData: Contribution | undefined;
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

  const [privateKey, setPrivateKey] = useState<null | string>(null);

  const handleOnFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.warn("No file selected.");
      setPrivateKey(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const privateKeyFromFile = e.target?.result as string | null;

      if (!privateKeyFromFile) {
        console.error("Error: Failed to read private key from file.");
        setPrivateKey(null);
        return;
      }

      setPrivateKey(privateKeyFromFile);
    };

    reader.onerror = () => {
      console.error(
        "Error: FileReader encountered an error while reading the file."
      );
      setPrivateKey(null);
    };

    reader.readAsText(file);
  };

  const handleDownloadedEncryptedData = async (dataCID: string) => {
    try {
      const pinata = new PinataSDK({
        pinataJwt: undefined,
        pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
      });

      const data = (await pinata.gateways.get(dataCID)).data;
      if (!data) {
        console.error("Error: Failed to get data from IPFS", dataCID);
        return false;
      }

      return data.toString();
    } catch (error) {
      console.error("Error: Failed to get data from IPFS", error);
      return false;
    }
  };

  const handleDecryptEncryptedAESKey = async (
    encryptedAESKeyHex: string,
    hexPrivateKey: string
  ) => {
    try {
      // Remove "0x" prefix if present
      if (hexPrivateKey.startsWith("0x")) {
        hexPrivateKey = hexPrivateKey.slice(2);
      }

      // Convert the hex private key to ArrayBuffer
      const keyBuffer = Buffer.from(hexPrivateKey, "hex");

      // Import the private key
      const importedPrivateKey = await crypto.subtle.importKey(
        "pkcs8", // Format of the private key
        keyBuffer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        true,
        ["decrypt"]
      );

      const encryptedBuffer = Buffer.from(encryptedAESKeyHex, "hex");

      // Decrypt the AES key
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        importedPrivateKey,
        encryptedBuffer
      );

      // Convert decrypted data to string (AES key)
      return new TextDecoder().decode(decryptedBuffer);
    } catch (error) {
      console.error("Error: Failed to decrypt AES key: ", error);
      return false;
    }
  };

  const handleDecryptEncryptedContentWithDecryptedAESKey = async (
    encryptedContent: string,
    decryptedAesKey: string
  ) => {
    try {
      const contentParts = encryptedContent.split(":");

      const ivPart = contentParts.shift();
      if (!ivPart) {
        throw new Error("IV not found");
      }

      const iv = Buffer.from(ivPart, "hex");
      const encryptedPart = Buffer.from(contentParts.join(":"), "hex");

      const keyBuffer = Buffer.from(decryptedAesKey, "hex");
      const decipher = createDecipheriv(
        "aes-256-cbc",
        Buffer.from(keyBuffer),
        iv
      );

      const decrypted = Buffer.concat([
        decipher.update(encryptedPart),
        decipher.final(),
      ]);

      return decrypted.toString("utf-8");
    } catch (error) {
      console.error("Error decrypting content:", error);
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

  const downloadDecryptedContentToComputer = (data: string) => {
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

  const handleDownloadButton = async () => {
    if (!submittedDataDocData) return;

    if (isDownloadLoading) return;
    if (privateKey === null) return;

    setIsDownloadLoading(true);

    const encryptedData = await handleDownloadedEncryptedData(
      submittedDataDocData.storeCid
    );
    if (!encryptedData) {
      return setIsDownloadLoading(false);
    }

    const aesKey = await handleDecryptEncryptedAESKey(
      submittedDataDocData.keyForDecryption,
      privateKey
    );
    if (!aesKey) {
      console.error("Error: Failed to decrypt AES key.");
      return setIsDownloadLoading(false);
    }

    const decryptedContent =
      await handleDecryptEncryptedContentWithDecryptedAESKey(
        encryptedData,
        aesKey
      );
    if (!decryptedContent) {
      console.error("Error: Failed to decrypt content.");
      return setIsDownloadLoading(false);
    }

    const cleanedData = cleanData(decryptedContent);
    if (!cleanedData) {
      console.error("Error: Failed to clean data.");
      return setIsDownloadLoading(false);
    }

    const isDownloaded = downloadDecryptedContentToComputer(cleanedData);
    if (!isDownloaded) {
      console.error("Error: Failed to download data.");
      return setIsDownloadLoading(false);
    }

    setIsDownloadLoading(false);
    setIsOpen(false);
  };

  if (!submittedDataDocData) {
    return null;
  }

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
                {submittedDataDocData.contributor}
              </div>
            </div>

            <div id="data-quality" className="flex flex-col">
              <div id="name" className="text-default-500 text-xs">
                Quality
              </div>
              <div id="id" className="text-sm">
                {submittedDataDocData.score}
              </div>
            </div>

            <div id="data-length" className="flex flex-col">
              <div id="name" className="text-default-500 text-xs">
                Token Length
              </div>
              <div id="id" className="text-sm">
                {submittedDataDocData.dataCount}
              </div>
            </div>

            <Input type="file" accept=".txt" onChange={handleOnFileChange} />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={handleCancelButton}>
              Close
            </Button>
            <Button
              color="primary"
              onPress={handleDownloadButton}
              isLoading={isDownloadLoading}
              isDisabled={privateKey === null}
              className="text-black"
            >
              Download
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
