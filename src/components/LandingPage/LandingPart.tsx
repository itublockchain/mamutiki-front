import { useEffect, useState } from "react";
import TextTransition, { presets } from "react-text-transition";
import VantaBackground from "../Background/VantaBackground";

const TEXTS = [
  "Decentralized & Unstoppable Data",
  "High-Quality Data",
  "Secure & Private Data",
  "On-Demand Intelligence",
  "Verifiable & Transparent Data",
  "AI-Ready Data",
  "Trusted & Reliable Data",
  "Scalable & Adaptive Data",
  "Tailored & Custom Data",
  "Web3-Enabled Data",
];

export default function LandingPart() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => setIndex((index) => index + 1), 1500);
    return () => clearTimeout(intervalId);
  }, []);

  const handleExploreMoreButton = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* <AnimatedBackground /> */}
      <VantaBackground />

      <div className="flex h-screen w-full relative bg-black/35 ">
        <div
          id="landing-content"
          className="flex flex-col w-full h-full z-20 gap-10 items-center justify-center "
        >
          <div
            id="main-texts"
            className="flex flex-col justify-center items-center gap-8"
          >
            <div
              id="dynamic-title-duo"
              className="flex flex-col justify-center items-center gap-3"
            >
              <div id="fixed-title" className="text-3xl font-bold">
                Power Your AI With
              </div>
              <TextTransition
                springConfig={presets.wobbly}
                className="justify-center"
              >
                <div className="bg-gradient-to-r from-[#DAA520] to-[#FFD700] bg-clip-text text-transparent text-5xl text-center font-bold">
                  {TEXTS[index % TEXTS.length]}
                </div>
              </TextTransition>
            </div>
            <div
              id="description-part"
              className="text-md text-center max-w-3xl text-gray-200"
            >
              Empower your AI development by launching custom data campaigns.
              Define your specific data needs and price, then let our
              decentralized marketplace on Aptos bring the right data directly
              to you—ensuring quality, transparency, and rapid innovation.
            </div>
          </div>

          <div
            id="button"
            className="flex px-5 py-2 bg-yellow-300 rounded-2xl text-black cursor-pointer"
            onClick={handleExploreMoreButton}
          >
            Explore More
          </div>
        </div>
      </div>
    </>
  );
}
