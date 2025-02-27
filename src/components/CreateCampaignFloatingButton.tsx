import { CreateCampaignModal } from "@/modals/CreateCampaignModal";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import React, { useState } from "react";

export default function CreateCampaignFloatingButton() {
  const { connected } = useWallet();

  const [isOpen, setIsOpen] = useState(false);

  if (!connected) return <></>;

  return (
    <>
      <div
        id="root"
        className="fixed flex md:hidden bottom-7 right-7 z-50 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div id="icon-part" className="flex items-center justify-center">
          <img src="/header/add.png" className="w-10 h-10" />
        </div>
      </div>

      <CreateCampaignModal isModalOpen={isOpen} setIsModalOpen={setIsOpen} />
    </>
  );
}
