import { useAptosClient } from "@/helpers/useAptosClient";
import { GetSubscriptionStatusResponse } from "@/types/Contract";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { useEffect, useState } from "react";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function SubscribeModal({ isOpen, setIsOpen }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const { subscribePremium, isAptosClientReady, getSubscriptionStatus } =
    useAptosClient();

  const handleCancelButton = () => {
    setIsOpen(false);
  };

  const [subscriptionStatus, setSubscriptionStatus] =
    useState<GetSubscriptionStatusResponse | null>(null);

  useEffect(() => {
    if (!isAptosClientReady) return;

    handleGetSubscriptionStatus();
  }, [isAptosClientReady]);

  const handleSubscribeButton = async () => {
    if (isLoading) return;

    setIsLoading(true);

    await subscribePremium();

    setIsLoading(false);
  };

  const handleGetSubscriptionStatus = async () => {
    if (!isAptosClientReady) return;

    const response = await getSubscriptionStatus();
    if (!response) {
      return setSubscriptionStatus(null);
    }

    setSubscriptionStatus(response);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancelButton}>
      <ModalContent>
        <ModalHeader>Premium</ModalHeader>
        <ModalBody>
          <div className="flex flex-col">
            {subscriptionStatus === null && <Spinner />}
            {subscriptionStatus !== null && (
              <>
                <div id="status" className="flex flex-row gap-2">
                  <div className="font-bold">Premium Status: </div>
                  <div>{subscriptionStatus.status ? "Active" : "Inactive"}</div>
                </div>
                {subscriptionStatus.status && (
                  <div id="remaining-time" className="flex flex-row gap-2">
                    <div className=" font-bold">Due: </div>
                    <div>
                      {new Date(
                        Date.now() + subscriptionStatus.remainingTime * 1000
                      ).toDateString()}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex gap-4">
            <Button onPress={handleCancelButton}>Cancel</Button>
            <Button
              color="primary"
              isLoading={isLoading}
              onPress={handleSubscribeButton}
              isDisabled={
                subscriptionStatus === null ||
                subscriptionStatus.status === true
              }
              className="text-black"
            >
              Subscribe
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
