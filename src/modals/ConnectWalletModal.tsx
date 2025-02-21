import { ConnectWalletOptionCard } from "@/components/ConnectWalletOptionCard";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { useEffect } from "react";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export function ConnectWalletModal({ isOpen, setIsOpen }: Props) {
  const { wallets = [], connected, isLoading } = useWallet();

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (connected) handleClose();
  }, [connected]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Connect Wallet
            </ModalHeader>
            <ModalBody>
              {isLoading ? (
                <Spinner color="warning" />
              ) : (
                <div className="flex flex-col gap-5">
                  {wallets.map((w) => (
                    <ConnectWalletOptionCard wallet={w} key={w.name} />
                  ))}
                </div>
              )}
            </ModalBody>
            <ModalFooter />
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
