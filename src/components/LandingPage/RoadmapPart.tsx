import React from "react";
import SpecCard from "./SpecCard";

export default function RoadmapPart() {
  return (
    <div
      id="root"
      className="flex flex-col w-full self-center gap-10 px-5 md:px-20 min-h-screen "
    >
      <div
        id="title"
        className="flex justify-center items-center w-full font-bold text-3xl"
      >
        Our Roadmap
      </div>
      <div className="flex flex-col md:grid md:grid-cols-3 gap-5 min-h-[50vh]">
        <SpecCard
          title="Q1"
          description="We will use our own token."
          className="h-full"
        />
        <SpecCard
          title="Q2"
          description="We will launch our
          platform."
        />
        <SpecCard
          title="Q3"
          description="We will onboard our first
          customers."
        />
      </div>
    </div>
  );
}
