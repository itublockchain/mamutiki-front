import { useAptosClient } from "@/helpers/useAptosClient";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react";

import { ArrowDownCircleIcon } from "@heroicons/react/24/solid";

import { useEffect, useState } from "react";

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
};

export function CreateCampaignModal({ isModalOpen, setIsModalOpen }: Props) {
  const [isCreateLoading, setIsCreateLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [stakedBalance, setStakedBalance] = useState("");
  const [dataSpec, setDataSpec] = useState("");

  const [dataKeyPair, setDataKeyPair] = useState<null | {
    publicKey: number[];
    privateKey: string;
  }>(null);

  const [isPrivateKeyDownloaded, setIsPrivateKeyDownloaded] = useState(false);

  const [validationErrors, setValidationErrors] = useState({
    title: "",
    description: "",
    dataSpec: "",
    unitPrice: "",
    statkedBalance: "",
  });

  const [creationError, setCreationError] = useState("");

  const { createCampaign } = useAptosClient();

  // Managing creating new key pair on modal open.
  useEffect(() => {
    if (!isModalOpen) {
      resetInputs();
    }
    handleCreateNewDataKeyPair();
  }, [isModalOpen]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (e.target.value.length === 0) {
      setValidationErrors({
        ...validationErrors,
        title: "Title is required",
      });
    } else {
      setValidationErrors({
        ...validationErrors,
        title: "",
      });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length === 0) {
      setValidationErrors({
        ...validationErrors,
        description: "Description is required",
      });
    } else {
      setValidationErrors({
        ...validationErrors,
        description: "",
      });
    }
    setDescription(e.target.value);
  };

  const handleUnitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handling Validation Errors
    if (e.target.value.length === 0 || Number(e.target.value) <= 0) {
      setValidationErrors({
        ...validationErrors,
        unitPrice: "Price offer is required",
      });
    } else {
      setValidationErrors({
        ...validationErrors,
        unitPrice: "",
      });
    }

    setUnitPrice(e.target.value);
  };

  const handleStakedBalanceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.value.length === 0 || Number(e.target.value) <= 0) {
      setValidationErrors({
        ...validationErrors,
        statkedBalance: "Staked balance is required",
      });
    } else {
      setValidationErrors({
        ...validationErrors,
        statkedBalance: "",
      });
    }

    setStakedBalance(e.target.value);
  };

  const handleDataSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length === 0) {
      setValidationErrors({
        ...validationErrors,
        dataSpec: "Data Spec is required",
      });
    } else {
      setValidationErrors({
        ...validationErrors,
        dataSpec: "",
      });
    }

    setDataSpec(e.target.value);
  };

  const handleCreateNewDataKeyPair = async () => {
    if (isCreateLoading) return;

    setDataKeyPair(null);
    setIsPrivateKeyDownloaded(false);

    try {
      const bufferToHex = (buffer: ArrayBuffer) =>
        Array.from(new Uint8Array(buffer))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

      const algorithm = {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      };

      const keyPair = await window.crypto.subtle.generateKey(
        algorithm,
        true, // key'ler dışa aktarılabilir
        ["encrypt", "decrypt"]
      );

      const publicKeyDer = await window.crypto.subtle.exportKey(
        "spki",
        keyPair.publicKey
      );

      const privateKeyDer = await window.crypto.subtle.exportKey(
        "pkcs8",
        keyPair.privateKey
      );

      // Converting to hex for user readability.
      const privateKeyHex = bufferToHex(privateKeyDer);

      // Converting public to number array for contract interaction compatibility.
      const publicKeyNumberArray = Array.from(new Uint8Array(publicKeyDer));

      return setDataKeyPair({
        publicKey: publicKeyNumberArray,
        privateKey: privateKeyHex,
      });
    } catch (error) {
      console.error("Error on handleCreateNewKeyButton: ", error);

      setIsPrivateKeyDownloaded(false);
      return setDataKeyPair(null);
    }
  };

  const handleDownloadPrivateKeyButton = () => {
    const privateKey = dataKeyPair?.privateKey;
    if (!privateKey) {
      console.error("Error: Private key not found");
      return setIsPrivateKeyDownloaded(false);
    }

    try {
      // Create a Blob with the JSON data
      const blob = new Blob([privateKey], {
        type: "text/plain",
      });

      // Create a temporary URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element
      const a = document.createElement("a");
      a.href = url;
      a.download = "key" + "-" + Date.now().toString() + ".txt"; // Set the filename

      // Trigger the download
      document.body.appendChild(a);
      a.click();

      // Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsPrivateKeyDownloaded(true);
    } catch (error) {
      console.error("Error: Failed to download data", error);
      return setIsPrivateKeyDownloaded(false);
    }
  };

  const handleCancelButton = () => {
    setIsModalOpen(false);
    resetInputs();
  };

  const handleCreateButton = async () => {
    if (isCreateLoading) return;

    setCreationError("");

    if (
      !title ||
      !description ||
      !dataSpec ||
      !unitPrice ||
      Number(unitPrice) <= 0 ||
      !stakedBalance ||
      Number(stakedBalance) <= 0
    ) {
      return setValidationErrors({
        title: !title ? "Title is required" : "",
        description: !description ? "Description is required" : "",
        statkedBalance:
          !stakedBalance || Number(unitPrice) <= 0
            ? "Staked balance is required"
            : "",
        unitPrice:
          !unitPrice || Number(unitPrice) <= 0 ? "Unit price is required" : "",
        dataSpec: !dataSpec ? "Data Spec is required" : "",
      });
    }

    if (!dataKeyPair) {
      console.error("Please create a key pair to continue.");
      return setCreationError("Please create a key pair");
    }

    if (!isPrivateKeyDownloaded) {
      console.error("Please download the private key to continue.");
      return setCreationError("Please download the private key.");
    }

    setIsCreateLoading(true);

    const result = await createCampaign({
      title: title,
      description: description,
      dataSpec: dataSpec,
      rewardPool: Number(BigInt(Math.round(Number(stakedBalance) * 100000000))),
      unitPrice: Number(BigInt(Math.round(Number(unitPrice) * 100000000))),
      publicKeyForEncryption: dataKeyPair.publicKey,
    });

    if (!result) {
      setCreationError("Failed to create campaign");
      return setIsCreateLoading(false);
    }

    setIsCreateLoading(false);
    resetInputs();

    return setIsModalOpen(false);
  };

  const resetInputs = () => {
    setTitle("");
    setDescription("");
    setUnitPrice("");
    setStakedBalance("");
    setDataSpec("");
    setDataKeyPair(null);
    setIsPrivateKeyDownloaded(false);
  };

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={handleCancelButton}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Create Campaign
          </ModalHeader>

          <ModalBody>
            <Input
              isInvalid={validationErrors.title.length > 0}
              isRequired
              label="Title"
              placeholder="Enter title for your campaign..."
              onChange={handleTitleChange}
              value={title}
            />

            <Textarea
              isInvalid={validationErrors.description.length > 0}
              isRequired
              label="Description"
              placeholder="Enter description for your campaign..."
              onChange={handleDescriptionChange}
              value={description}
            />

            <Input
              type="number"
              isInvalid={validationErrors.unitPrice.length > 0}
              isRequired
              label="Unit Price (APT)"
              onChange={handleUnitPriceChange}
              value={unitPrice.toString()}
            />

            <Input
              isInvalid={validationErrors.statkedBalance.length > 0}
              isRequired
              label="Staked Balance (APT)"
              type="number"
              onChange={handleStakedBalanceChange}
              value={stakedBalance.toString()}
            />

            <Textarea
              isInvalid={validationErrors.dataSpec.length > 0}
              isRequired
              label="Data Spec"
              placeholder="Enter data spec for your campaign..."
              onChange={handleDataSpecChange}
              value={dataSpec}
            />

            <div className=" text-xs text-warning-500">
              Please save your private key below. You will need it to decrypt
              the data you receive. Note that this key will be shown only once.
            </div>
            <Input
              value={
                (dataKeyPair && dataKeyPair.privateKey.slice(0, 30) + "...") ||
                "Please create a key pair"
              }
              label="Private Key"
              endContent={
                <Button onPress={handleDownloadPrivateKeyButton}>
                  <ArrowDownCircleIcon />
                </Button>
              }
              disabled
            />

            <Button onPress={handleCreateNewDataKeyPair}>Create New Key</Button>

            {creationError && (
              <div className="text-xs text-red-500">{creationError}</div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              variant="light"
              onPress={handleCancelButton}
              isDisabled={isCreateLoading}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleCreateButton}
              isDisabled={isCreateLoading || !isPrivateKeyDownloaded}
              isLoading={isCreateLoading}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
