import Link from "next/link";

type Props = {
  title: string;
  unitPrice: number;
  staked: number;
  id: number;
  campaigner: string;
  remainingStakes: number;
  description: string;
};

export default function CampaignCard({
  title,
  unitPrice,
  staked,
  id,
  description,
}: Props) {
  return (
    <Link
      href={`/app/campaigns/${id}`}
      className="flex flex-col w-full md:w-[305px] gap-7 justify-center bg-gradient-to-b from-gray-950 to-[#99977348] px-6 py-7 rounded-xl border-b border-l border-yellow-300/40 transition transform duration-300 hover:scale-105 hover:shadow-lg"
    >
      <div id="title-description" className="flex flex-col overflow-auto">
        <div id="title" className="text-xl font-bold text-yellow-300">
          {title}
        </div>
        <div id="description" className="text-gray-400 text-xs min-h-12">
          {description}
        </div>
      </div>

      <div id="money-part" className="flex flex-row gap-5 text-white text-xs">
        <div id="staked-part" className="flex flex-col">
          <div id="label" className="text-gray-500">
            Total Staked
          </div>

          <div id="value" className="text-yellow-300">
            {staked} DATA
          </div>
        </div>

        <div id="unit-part" className="flex flex-col">
          <div id="label" className="text-gray-500">
            Unit Price
          </div>
          <div id="value" className="text-yellow-300">
            {unitPrice} DATA
          </div>
        </div>
      </div>

      <div id="buttons-part" className="flex w-full">
        <div
          id="submit-button"
          className="flex w-full justify-center items-center text-sm bg-primary text-black rounded-lg py-1.5 px-6 transition transform duration-300 hover:scale-105 hover:shadow-lg"
        >
          Submit
        </div>
      </div>
    </Link>
  );
}
