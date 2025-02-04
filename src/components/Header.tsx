import { auth } from "@/firebase/clientApp";
import { CreateCampaignModal } from "@/modals/CreateCampaignModal";
import { useAuth } from "@/providers/AuthProvider";
import { PlusIcon } from "@heroicons/react/16/solid";
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

  return (
    <>
      <div
        id="header"
        className="flex w-full h-16 justify-between items-center"
      >
        <Link href="/" id="logo" className="font-bold text-large">
          Data Marketplace
        </Link>
        <div
          id="right-side"
          className="flex gap-5 items-center"
          style={{
            display: user ? "flex" : "none",
          }}
        >
          <Button
            color="primary"
            onPress={handleCreateButtonAtHeader}
            endContent={<PlusIcon className="w-5 h-5" />}
          >
            Create Campaign
          </Button>

          <Button
            color="warning"
            onPress={handleSignOutButton}
            spinner={signOutLoading}
          >
            Sign Out
          </Button>
        </div>
      </div>

      <CreateCampaignModal
        isModalOpen={isCreateCampaignModalOpen}
        setIsModalOpen={setIsCreateCampaignModalOpen}
      />
    </>
  );
}
