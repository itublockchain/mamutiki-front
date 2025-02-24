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
      href={`/campaigns/${id}`}
      className="flex flex-col gap-7 justify-center bg-gradient-to-bl from-gray-950 to-[#99977359] px-6 py-7 rounded-xl border-b border-l border-yellow-300/40 transition transform duration-300 hover:scale-105 hover:shadow-lg"
    >
      <div id="title-description" className="flex flex-col overflow-auto">
        <div id="title" className="text-xl font-bold text-yellow-300">
          {title}
        </div>
        <div id="description" className="text-gray-400 text-xs">
          {description}
        </div>
      </div>

      <div id="money-part" className="flex flex-col gap-2 text-white text-xs">
        <div id="unit-part" className="flex flex-col">
          <div id="label" className="text-gray-500">
            Unit Price
          </div>
          <div id="value" className="text-yellow-300">
            {unitPrice} MAMU
          </div>
        </div>

        <div id="staked-part" className="flex flex-col">
          <div id="label" className="text-gray-500">
            Total Staked
          </div>
          <div id="value" className="text-yellow-300">
            {staked} MAMU
          </div>
        </div>
      </div>

      <div id="buttons-part" className="flex flex-row gap-5">
        <div
          id="submit-button"
          className="flex justify-center items-center text-sm bg-primary text-black rounded-lg py-1.5 px-6 transition transform duration-300 hover:scale-105 hover:shadow-lg"
        >
          Submit
        </div>
        <div
          id="learn-more-button"
          className="flex flex-grow justify-center items-center text-sm border border-primary text-primary rounded-lg py-1.5 px-6 transition transform duration-300 hover:scale-105 hover:bg-primary hover:text-black hover:border-transparent"
        >
          Learn More
        </div>
      </div>
    </Link>
  );
}
