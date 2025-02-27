import React from "react";
import StepCard from "./StepCard";
import Image from "next/image";

export default function HowToStartPart() {
  return (
    <div
      id="how-to-start-part-root"
      className="flex flex-col w-full  min-h-screen items-center gap-10 bg-black/50 p-20"
    >
      <div id="title-part" className="flex font-bold text-3xl">
        HOW TO START
      </div>

      <div
        id="step-cards"
        className="flex flex-row flex-wrap justify-center gap-5"
      >
        <StepCard
          iconURL="/step/nightly_logo.png"
          title="Step 1"
          description="Download and Create Nightly Wallet"
          imageURL="/step/nightly.png"
        />

        <StepCard
          iconURL="/step/movement.png"
          title="Step 2"
          description="Choose Movement Network"
          imageURL="/step/chain.png"
          className="md:mt-[5rem]"
        />

        <StepCard
          iconURL="/step/flaskk.png"
          title="Step 3"
          description="Switch to Bardock Testnet"
          imageURL="/step/testnet.png"
          className="md:mt-[10rem]"
        />
      </div>

      <div
        id="ready-part"
        className="flex flex-row flex-wrap justify-center items-center gap-3 md:gap-5"
      >
        <div
          id="text-part"
          className="flex text-lg md:text-2xl font-bold text-white"
        >
          Ready to Use
        </div>
        <div
          id="image-part"
          className="flex h-[33px] w-[183px] md:h-[44px] md:w-[244px]"
        >
          <Image
            src="/step/ready_to_use.svg"
            alt="Ready To Use Image"
            width={244}
            height={44}
          />
        </div>
      </div>
    </div>
  );
}
