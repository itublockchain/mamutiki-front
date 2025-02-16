import {
  GetCampaignFunctionContractResponse,
  GetCampaignFunctionResponse,
} from "@/types/Contract";

export const parseCampaignResponse = (
  response: GetCampaignFunctionContractResponse
): GetCampaignFunctionResponse => {
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

type FunctionAccessStringCreatorProps =
  | {
      moduleName: "campaign_manager";
      functionName:
        | "create_campaign"
        | "get_all_campaigns"
        | "get_campaign"
        | "get_public_key_for_encryption";
    }
  | {
      moduleName: "contribution_manager";
      functionName: "add_contribution" | "get_campaign_contributions";
    };

export const functionAccessStringCreator = ({
  functionName,
  moduleName,
}: FunctionAccessStringCreatorProps):
  | `${string}::${string}::${string}`
  | false => {
  const accountAddress =
    process.env.NEXT_PUBLIC_MODULE_ADDRESS_WITH_0X_PREFIX || "";
  if (!accountAddress) {
    console.error("Account address not found from .env file");
    return false;
  }

  return `${accountAddress}::${moduleName}::${functionName}`;
};
