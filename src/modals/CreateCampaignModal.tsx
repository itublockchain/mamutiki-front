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
import { useState } from "react";

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

  const [validationErrors, setValidationErrors] = useState({
    title: "",
    description: "",
    dataSpec: "",
    unitPrice: "",
    statkedBalance: "",
  });

  const [creationError, setCreationError] = useState("");

  const { createCampaign } = useAptosClient();

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

  const handleCancelButton = () => {
    setIsModalOpen(false);
  };

  const handleCreateButton = async () => {
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

    setIsCreateLoading(true);

    const result = await createCampaign({
      title: title,
      description: description,
      dataSpec: dataSpec,
      rewardPool: Number(stakedBalance) * 100000000,
      unitPrice: Number(unitPrice) * 100000000,
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
              isDisabled={isCreateLoading}
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
