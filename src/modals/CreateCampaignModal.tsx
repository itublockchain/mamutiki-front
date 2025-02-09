import { auth, firestore } from "@/firebase/clientApp";
import { useAptosClient } from "@/helpers/useAptosClient";
import { CampaignDocData, CampaignSector } from "@/types/Campaign";
import { CampaignerDocData } from "@/types/Campaigner";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Slider,
} from "@heroui/react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useState } from "react";

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
};

export function CreateCampaignModal({ isModalOpen, setIsModalOpen }: Props) {
  const [isCreateLoading, setIsCreateLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sector, setSector] = useState<CampaignSector | null>(null);
  const [unitPrice, setUnitPrice] = useState(0);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [minDataQuality, setMinDataQuality] = useState(70);
  const [minDataQuantity, setMinDataQuantity] = useState(5000);

  const [validationErrors, setValidationErrors] = useState({
    title: "",
    description: "",
    sector: "",
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

  const handleSectorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length === 0) {
      setValidationErrors({
        ...validationErrors,
        sector: "Sector is required",
      });
    } else {
      setValidationErrors({
        ...validationErrors,
        sector: "",
      });
    }
    setSector(e.target.value as CampaignSector);
  };

  const handleUnitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setUnitPrice(Number(e.target.value));
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

    setStakedBalance(Number(e.target.value));
  };

  const handleMinDataQualityChange = (value: number | number[]) => {
    if (typeof value === "number") {
      setMinDataQuality(value);
    } else {
      setMinDataQuality(value[0]);
    }
  };

  const handleMinDataQuantityChange = (value: number | number[]) => {
    if (typeof value === "number") {
      setMinDataQuantity(value);
    } else {
      setMinDataQuantity(value[0]);
    }
  };

  const handleCancelButton = () => {
    setIsModalOpen(false);
  };

  const handleCreateButton = async () => {
    if (!title || !description || !sector || !unitPrice || !stakedBalance) {
      return setValidationErrors({
        title: !title ? "Title is required" : "",
        description: !description ? "Description is required" : "",
        sector: !sector ? "Sector is required" : "",
        statkedBalance: !stakedBalance ? "Staked balance is required" : "",
        unitPrice: !unitPrice ? "Price offer is required" : "",
      });
    }

    const isFirebase =
      process.env.NEXT_PUBLIC_IS_FIREBASE === "TRUE" ? true : false;

    if (!isFirebase) {
      setIsCreateLoading(true);

      const result = await createCampaign(
        sector,
        `${title}-${description}-${sector}-${unitPrice}-${minDataQuality}-${minDataQuantity}`,
        stakedBalance
      );

      console.log("Result: ", result);

      setIsModalOpen(false);
      return setIsCreateLoading(false);
    }

    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const newDocData: CampaignDocData = {
      title,
      description,
      sector,
      unitPrice,
      stakedBalance,
      offerCurrency: "USDT",
      id: "", // will be updated.
      creatorId: currentUser.uid,
      creationTs: Date.now(),
      minDataQuality,
      minDataQuantity,
      status: "open",
      remainingStatkedBalance: stakedBalance,
      submitCount: 0,
    };

    try {
      // Adding new doc to "/campaigns" Collection
      const campaignCollectionRef = collection(firestore, "/campaigns");
      const addDocResult = await addDoc(campaignCollectionRef, newDocData);

      // Updating ID
      const newDocRef = doc(firestore, addDocResult.path);
      updateDoc(newDocRef, { id: newDocRef.id });
    } catch (error) {
      console.error(error);
      setCreationError("An error occured while creating campaign");
      return setIsCreateLoading(false);
    }

    // Updating or setting campaigner doc
    try {
      const possibleCampaignerDoc = await getDoc(
        doc(firestore, `/campaigners/${currentUser.uid}`)
      );

      const doesExistBefore = possibleCampaignerDoc.exists();

      if (!doesExistBefore) {
        const newData: CampaignerDocData = {
          id: currentUser.uid,
          campaignCount: 1,
          totalSpent: 0,
          totalStaked: stakedBalance,
          creationTs: Date.now(),
        };

        await setDoc(
          doc(firestore, `/campaigners/${currentUser.uid}`),
          newData
        );
      } else {
        await updateDoc(doc(firestore, `/campaigners/${currentUser.uid}`), {
          campaignCount: increment(1),
          totalStaked: increment(stakedBalance),
        });
      }
    } catch (error) {
      console.error(error);
      setCreationError("An error occured while updating campaigner");
      return setIsCreateLoading(false);
    }

    // Updating States
    setIsCreateLoading(false);
    setIsModalOpen(false);

    // Resetting Inputs
    return resetInputs();
  };

  const resetInputs = () => {
    setTitle("");
    setDescription("");
    setSector(null);
    setUnitPrice(0);
    setMinDataQuality(70);
    setMinDataQuantity(5000);
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

            <Input
              isInvalid={validationErrors.description.length > 0}
              isRequired
              label="Description"
              placeholder="Enter description for your campaign..."
              onChange={handleDescriptionChange}
              value={description}
            />

            <RadioGroup
              isInvalid={validationErrors.sector.length > 0}
              isRequired
              label="Sector of Data"
              onChange={handleSectorChange}
              value={sector}
            >
              <Radio value="health">Health</Radio>
              <Radio value="finance">Finance</Radio>
              <Radio value="agriculture">Agriculture</Radio>
              <Radio value="education">Education</Radio>
              <Radio value="other">Other</Radio>
            </RadioGroup>

            <Input
              isInvalid={validationErrors.unitPrice.length > 0}
              isRequired
              label="Unit Price (USDT)"
              type="number"
              onChange={handleUnitPriceChange}
              value={unitPrice.toString()}
            />

            <Input
              isInvalid={validationErrors.statkedBalance.length > 0}
              isRequired
              label="Staked Balance (USDT)"
              type="number"
              onChange={handleStakedBalanceChange}
              value={stakedBalance.toString()}
            />

            <Slider
              className="max-w-md"
              label="Minimum Data Quality (%)"
              minValue={0}
              maxValue={100}
              step={1}
              marks={[
                {
                  value: 20,
                  label: "20%",
                },
                {
                  value: 50,
                  label: "50%",
                },
                {
                  value: 80,
                  label: "80%",
                },
              ]}
              onChange={handleMinDataQualityChange}
              value={minDataQuality}
            />

            <Slider
              className="max-w-md"
              label="Minimum Data Quantity (token)"
              minValue={0}
              maxValue={10000}
              step={1000}
              marks={[
                {
                  value: 2000,
                  label: "20%",
                },
                {
                  value: 5000,
                  label: "50%",
                },
                {
                  value: 8000,
                  label: "80%",
                },
              ]}
              onChange={handleMinDataQuantityChange}
              value={minDataQuantity}
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
