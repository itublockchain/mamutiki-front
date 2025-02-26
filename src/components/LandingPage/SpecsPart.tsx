import React from "react";
import SpecCard from "./SpecCard";

export default function SpecsPart() {
  return (
    <div
      id="root"
      className="flex flex-col w-full self-center gap-10  px-5 md:px-20"
    >
      <div
        id="title"
        className="flex justify-center items-center w-full font-extrabold text-4xl"
      >
        FEATURES
      </div>
      <div
        id="content"
        className="flex flex-col gap-5 md:grid md:grid-cols-4 md:grid-rows-4 md:gap-4 min-h-screen"
      >
        {/* Top-Left Large Card */}

        <SpecCard
          title="Bulletproof Security"
          description="End-to-end RSA and AES encryption ensures your data remains inaccessible to unauthorized users."
          iconURL="/features/bullet_proof_securtiy.png"
          className="col-span-2 row-span-2"
        />

        <SpecCard
          title="Premium Quality"
          description="Advanced AI models analyze submissions to guarantee top-tier, campaign-tailored data every time."
          iconURL="/features/premium_quality.png"
          className="col-span-2 row-span-1"
        />

        <SpecCard
          title="Lightning Speed"
          description="Built on Aptos, our platform delivers ultra-fast transactions—up to 160,000 TPS—for unmatched performance."
          iconURL="/features/ligthing_spped.png"
          className="col-span-2 row-span-1"
        />

        <SpecCard
          title="Bespoke Data"
          description="Campaign creators set precise criteria to receive customized, high-quality data that perfectly fits their needs."
          iconURL="/features/bespoke_data.png"
          className="col-span-2 row-span-1"
        />

        <SpecCard
          title="Instant Rewards"
          description="Enjoy prompt, immediate compensation when you submit valid data to any campaign."
          iconURL="/features/instant_rewards.png"
          className="col-span-2 row-span-2"
        />

        <SpecCard
          title="Fortified Contracts"
          description="Our Move-based smart contracts deliver robust, secure, and reliable automation for seamless operations."
          iconURL="/features/fortified_contracts.png"
          className="col-span-2 row-span-1"
        />
      </div>
    </div>
  );
}
