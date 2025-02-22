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
  campaigner,
  remainingStakes,
  description,
}: Props) {
  return (
    <Link
      href={`/campaigns/${id}`}
      className="flex flex-col min-h-48 border border-yellow-300 border-dotted rounded-2xl p-5 gap-3 overflow-auto"
    >
      <div id="id" className="flex flex-col items-end justify-center">
        <div className="text-xs font-bold text-gray-500">Campaign ID</div>
        <div className="text-xs">{id}</div>
      </div>

      <div id="campaigner-data" className="flex flex-row gap-2 items-center">
        <img
          className="w-8 h-8 rounded-full"
          src={`https://picsum.photos/seed/picsum/200/200?random=${campaigner}`}
          alt="Campaign Creator"
        />

        <div className="flex flex-col cursor-pointer">
          <div className="text-xs font-bold text-gray-500">
            Campaign Creator
          </div>
          <div className="text-xs">{campaigner.slice(0, 30)}...</div>
        </div>
      </div>

      <div id="title" className="flex flex-col">
        <div className="text-xs font-bold text-gray-500">Title</div>
        <div className="text-xs">{title}</div>
      </div>

      <div id="description" className="flex flex-col">
        <div className="text-xs font-bold text-gray-500">Description</div>
        <div className="text-xs">{description}</div>
      </div>

      <div
        id="staked"
        className="flex flex-row items-center justify-between p-2 border border-gray-500 rounded-2xl"
      >
        <div className="text-xs font-bold text-gray-500">Total Staked</div>
        <div className="text-xs">{staked} APT</div>
      </div>

      <div
        id="remaining-stakes"
        className="flex flex-row items-center justify-between p-2 border border-gray-500 rounded-2xl"
      >
        <div className="text-xs font-bold text-gray-500">Remaining Staked</div>
        <div className="text-xs">{remainingStakes} APT</div>
      </div>

      <div
        id="unit-price"
        className="flex flex-row items-center justify-between p-2 border border-gray-500 rounded-2xl"
      >
        <div className="text-xs font-bold text-gray-500">Unit Price</div>
        <div className="text-xs">{unitPrice} APT</div>
      </div>

      <div
        id="view-campaign-button"
        className="flex text-sm font-bold px-3 p-2 bg-yellow-300 rounded-2xl text-black items-center justify-center"
      >
        View Campaign
      </div>
    </Link>
  );
}
