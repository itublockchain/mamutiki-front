import { ConnectWalletOptionCard } from "@/components/ConnectWalletOptionCard";
import {
  AptosStandardSupportedWallet,
  useWallet,
  Wallet,
} from "@aptos-labs/wallet-adapter-react";
import {
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

export function ConnectWalletModal({ isOpen, setIsOpen }: Props) {
  const { wallets = [], connected, isLoading } = useWallet();

  const [supportedWallets, setSupportedWallets] = useState<
    (Wallet | AptosStandardSupportedWallet<string>)[]
  >([]);

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (connected) handleClose();
  }, [connected]);

  // Manage Supported Wallets
  useEffect(() => {
    // "OKX Wallet" "Razor Wallet" "Nightly"
    const supportedWalletsFetched = wallets.filter(
      (w) => w.name === "Razor Wallet" || w.name === "Nightly"
    );
    setSupportedWallets(supportedWalletsFetched);
  }, [wallets]);

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
                  {supportedWallets.map((w) => (
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
