import React from "react";
import SpecCard from "./SpecCard";

export default function SpecsPart() {
  return (
    <div id="root" className="flex flex-col w-full self-center gap-10 px-20">
      <div
        id="title"
        className="flex justify-center items-center w-full font-extrabold text-4xl"
      >
        Features
      </div>
      <div
        id="content"
        className="grid grid-cols-4 grid-rows-3 gap-4 min-h-screen"
      >
        {/* Top-Left Large Card */}
        <SpecCard
          title="Bulletproof Security"
          description="End-to-end RSA and AES encryption ensures your data remains inaccessible to unauthorized users."
          className="col-span-2 row-span-2"
        />

        {/* Top-Right Split into Two Small Cards */}
        <div className="grid grid-cols-2 col-span-2 row-span-1 gap-4">
          <SpecCard
            title="Lightning Speed"
            description="Built on Aptos, our platform delivers ultra-fast transactions—up to 160,000 TPS—for unmatched performance."
          />
          <SpecCard
            title="Premium Quality"
            description="Advanced AI models analyze submissions to guarantee top-tier, campaign-tailored data every time."
          />
        </div>

        {/* Bottom-Left Small Card */}
        <SpecCard
          title="Instant Rewards"
          description="Enjoy prompt, immediate compensation when you submit valid data to any campaign."
          className="col-span-2 row-span-1"
        />

        {/* Mid-right Medium Card */}
        <SpecCard
          title="Bespoke Data"
          description="Campaign creators set precise criteria to receive customized, high-quality data that perfectly fits their needs."
          className="col-span-2 row-span-1"
        />

        {/* Bottom-Right Small Card */}
        <SpecCard
          title="Fortified Contracts"
          description="Our Move-based smart contracts deliver robust, secure, and reliable automation for seamless operations."
          className="col-span-2 row-span-1 "
        />
      </div>
    </div>
  );
}
