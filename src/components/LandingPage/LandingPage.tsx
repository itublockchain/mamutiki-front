import Background from "../Background/Background";
import HowToStartPart from "./HowToStartPart";
import LandingPart from "./LandingPart";
import RoadmapPart from "./RoadmapPart";
import SpecsPart from "./SpecsPart";

export default function LandingPage() {
  return (
    <>
      <Background />
      <div
        id="not-logged-root"
        className="flex flex-col relative w-full self-center gap-20 z-10"
      >
        <LandingPart />
        <SpecsPart />
        <RoadmapPart />
        <HowToStartPart />
      </div>
    </>
  );
}
