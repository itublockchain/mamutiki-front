import { GetCampaignFunctionResponse } from "@/types/Contract";

export const parseCampaignResponse = (
  response: any
): GetCampaignFunctionResponse => {
  const hexToUtf8 = (hexString: string) => {
    if (hexString.startsWith("0x")) {
      hexString = hexString.slice(2);
    }
    return Buffer.from(hexString, "hex").toString("utf-8");
  };

  return {
    id: Number(response.id),
    title: response.title,
    description: response.description,
    creator: response.creator,
    data_spec: response.prompt,
    reward_pool: Number(response.reward_pool) / 100000000,
    remaining_reward: Number(response.remaining_reward) / 100000000,
    unit_price: Number(response.unit_price) / 100000000,
    active: response.active,
  };
};

export const functionAccessStringCreator = (
  moduleName: string,
  functionName: string
): `${string}::${string}::${string}` | false => {
  const accountAddress = process.env.NEXT_PUBLIC_ACCOUNT_ADDRESS || "";
  if (!accountAddress) {
    console.error("Account address not found from .env file");
    return false;
  }

  return `${accountAddress}::${moduleName}::${functionName}`;
};
