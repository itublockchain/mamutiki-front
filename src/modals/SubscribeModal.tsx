import { useAptosClient } from "@/helpers/useAptosClient";
import { GetSubscriptionStatusResponse } from "@/types/Contract";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
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

  const { account } = useWallet();

  const handleCancelButton = () => {
    setIsOpen(false);
  };

  const [subscriptionStatus, setSubscriptionStatus] =
    useState<GetSubscriptionStatusResponse | null>(null);

  useEffect(() => {
    if (isAptosClientReady && account) handleGetSubscriptionStatus();
  }, [isAptosClientReady, account]);

  const handleSubscribeButton = async () => {
    if (isLoading) return;

    setIsLoading(true);

    await subscribePremium();

    await handleGetSubscriptionStatus();

    setIsLoading(false);
  };

  const handleGetSubscriptionStatus = async () => {
    if (!isAptosClientReady) return;
    if (!account) return;

    const response = await getSubscriptionStatus();
    if (!response) {
      return setSubscriptionStatus(null);
    }

    setSubscriptionStatus(response);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancelButton} hideCloseButton={true}>
      <ModalContent>
        <div
          id="icon"
          className=" absolute flex top-0 right-0 items-center justify-center"
        >
          <img src="/crown.png" className="w-24 h-24" alt="premium" />
        </div>

        <ModalHeader>Premium</ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-5">
            {subscriptionStatus === null && <Spinner />}
            {subscriptionStatus !== null && (
              <>
                <div id="status-rt" className="flex flex-col gap-1">
                  <div id="status" className="flex flex-row gap-2">
                    <div className="font-bold">Premium Status: </div>
                    <div>
                      {subscriptionStatus.status ? "Active" : "Inactive"}
                    </div>
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
                </div>

                <div
                  id="features"
                  className="flex flex-col p-3 gap-1 text-sm border border-primary rounded-lg"
                >
                  <div className="text-primary">
                    1. A better artificial intelligence model with higher
                    accuracy.
                  </div>
                  <div className="text-primary">
                    2. More experienced contributions.
                  </div>
                  <div className="text-primary">3. Exclusive tools.</div>
                </div>
              </>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="flex gap-4">
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
