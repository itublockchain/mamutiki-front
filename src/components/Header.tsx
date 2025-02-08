import { auth } from "@/firebase/clientApp";
import { CreateCampaignModal } from "@/modals/CreateCampaignModal";
import { LogInModal } from "@/modals/LoginModal";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@heroui/react";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useState } from "react";

type Props = {};

export function Header({}: Props) {
  const { user } = useAuth();

  const [signOutLoading, setSignOutLoading] = useState(false);

  const [isCreateCampaignModalOpen, setIsCreateCampaignModalOpen] =
    useState(false);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleSignOutButton = async () => {
    setSignOutLoading(true);

    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error on signing out: ", error);
    }

    setSignOutLoading(false);
  };

  const handleCreateButtonAtHeader = () => {
    setIsCreateCampaignModalOpen(true);
  };

  const handleLoginButton = () => {
    setIsLoginModalOpen(true);
  };

  return (
    <>
      <nav
        id="header-root"
        className=" sticky top-0 w-full flex justify-center items-center h-32 backdrop-blur-sm z-[9999]"
      >
        <div
          id="header"
          className="flex h-2/3 w-3/6 border border-gray-700 rounded-2xl items-center justify-between px-5 bg-black/70 backdrop-blur-3xl z-[9999]"
        >
          <Link href="/">
            <div
              id="logo"
              className="text-default text-xl font-bold cursor-pointer"
            >
              Datagy
            </div>
          </Link>

          <div id="contents" className="flex flex-row gap-6 text-default">
            <div id="about">About</div>
            <div id="white-paper">White Paper</div>
          </div>

          {user && (
            <div id="authed-left-part" className="flex gap-2">
              <Button onPress={handleCreateButtonAtHeader}>
                Create Campaign
              </Button>
              <Button onPress={handleSignOutButton}>Sign Out</Button>
            </div>
          )}

          {!user && <Button onPress={handleLoginButton}>Connect Wallet</Button>}
        </div>
      </nav>

      <CreateCampaignModal
        isModalOpen={isCreateCampaignModalOpen}
        setIsModalOpen={setIsCreateCampaignModalOpen}
      />

      <LogInModal
        isOpen={isLoginModalOpen}
        setIsLoginModalOpen={setIsLoginModalOpen}
      />
    </>
  );
}
