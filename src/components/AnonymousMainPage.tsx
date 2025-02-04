import { LogInModal } from "@/modals/LoginModal";
import { Button } from "@heroui/react";
import React, { useState } from "react";

type Props = {};

export function AnonymousMainPage({}: Props) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginButton = () => {
    setIsLoginModalOpen(true);
  };

  return (
    <div
      id="not-logged-root"
      className="flex flex-col w-full h-full justify-center items-center gap-3"
    >
      <div>Welcome to Data Marketplace</div>
      <Button onPress={handleLoginButton}>Log In</Button>

      <LogInModal
        isOpen={isLoginModalOpen}
        setIsLoginModalOpen={setIsLoginModalOpen}
      />
    </div>
  );
}
