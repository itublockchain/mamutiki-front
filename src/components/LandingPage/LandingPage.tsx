import RoadmapPart from "./RoadmapPart";
import LandingPart from "./LandingPart";
import SpecsPart from "./SpecsPart";

export default function LandingPage() {
  return (
    <div
      id="not-logged-root"
      className="flex flex-col w-full self-center gap-20"
    >
      <LandingPart />
      <SpecsPart />
      <RoadmapPart />
    </div>
  );
}
