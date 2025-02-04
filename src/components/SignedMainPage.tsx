import { CurrentCampaigns } from "./CurrentCampaigns";

type Props = {};

export function SignedMainPage({}: Props) {
  return (
    <div className="mt-10">
      <CurrentCampaigns />
    </div>
  );
}
