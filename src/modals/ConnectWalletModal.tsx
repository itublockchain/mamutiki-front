import { ConnectWalletOptionCard } from "@/components/ConnectWalletOptionCard";
import {
  groupAndSortWallets,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export function ConnectWalletModal({ isOpen, setIsOpen }: Props) {
  const { wallets = [] } = useWallet();

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Connect Wallet
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-5">
                {wallets.map((w) => (
                  <ConnectWalletOptionCard
                    wallet={w}
                    key={w.name}
                    onConnect={handleClose}
                  />
                ))}
              </div>
            </ModalBody>
            <ModalFooter />
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
