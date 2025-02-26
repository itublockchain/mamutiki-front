import Link from "next/link";
import { useEffect, useState } from "react";
import TextTransition, { presets } from "react-text-transition";

const TEXTS = [
  "Decentralized Data",
  "Unstoppable Data",
  "High-Quality Data",
  "Secure Data",
  "Private Data",
  "Verifiable Data",
  "AI-Ready Data",
  "Trusted Data",
  "Reliable Data",
  "Scalable Data",
  "Adaptive Data",
  "Tailored Data",
  "Web3 Data",
];

export default function LandingPart() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => setIndex((index) => index + 1), 3000);
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
      <div className=" flex h-screen w-full relative">
        <div
          id="landing-content"
          className="flex flex-col w-full h-full z-20 gap-8 md:gap-10 items-center justify-center p-5 md:p-0 "
        >
          <div
            id="main-texts"
            className="flex flex-col justify-center items-center gap-8 md:gap-8"
          >
            <div
              id="dynamic-title-duo"
              className="flex flex-col justify-center items-center md:gap-3"
            >
              <div id="fixed-title" className="text-2xl md:text-3xl font-bold">
                Power Your AI With
              </div>
              <TextTransition
                springConfig={presets.wobbly}
                className="justify-center"
              >
                <div className="bg-gradient-to-r from-[#DAA520] to-[#FFD700] bg-clip-text text-transparent text-4xl md:text-5xl text-center font-bold">
                  {TEXTS[index % TEXTS.length]}
                </div>
              </TextTransition>
            </div>

            <div
              id="description-part"
              className="text-sm md:text-base text-center max-w-3xl md:max-w-2xl text-gray-200"
            >
              Empower your AI development by launching custom data campaigns.
              Define your specific data needs and price, then let our
              decentralized marketplace on Movement bring the right data
              directly to you—ensuring quality, transparency, and rapid
              innovation.
            </div>
          </div>

          <div
            id="buttons-part"
            className="flex flex-row w-[25%] gap-5 items-center"
          >
            <div
              id="learn-more-button"
              className="flex items-center justify-center w-[40%] text-sm py-2 border border-primary rounded-lg text-primary cursor-pointer"
              onClick={handleExploreMoreButton}
            >
              Learn More
            </div>

            <Link
              href="/app"
              id="launch-dapp--button"
              className="flex items-center justify-center w-[60%] text-sm py-2 bg-yellow-300 font-bold rounded-lg text-black cursor-pointer"
            >
              Launch Dapp
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
