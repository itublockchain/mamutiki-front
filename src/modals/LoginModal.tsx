import { auth } from "@/firebase/clientApp";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  setIsLoginModalOpen: (isOpen: boolean) => void;
};

export function LogInModal({ isOpen, setIsLoginModalOpen }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLogInButton = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error on log-in: ", error);
      setError("Error on log-in: " + error);
    }

    setIsLoginModalOpen(false);
    setLoading(false);
  };

  const handleCloseButton = async () => {
    setIsLoginModalOpen(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleCloseButton}>
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">Log In</ModalHeader>
            <ModalBody>
              <Input label="Email" type="email" onChange={handleEmailChange} />
              <Input
                label="Password"
                type="password"
                onChange={handlePasswordChange}
              />
              {error && <div className="text-xs text-red-500">{error}</div>}
            </ModalBody>
            <ModalFooter>
              <Button
                color="secondary"
                variant="light"
                onPress={handleCloseButton}
              >
                Close
              </Button>
              <Button
                color="primary"
                onPress={handleLogInButton}
                isLoading={loading}
              >
                Log In
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
