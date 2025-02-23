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
    reward_pool: convertBalance(response.reward_pool),
    remaining_reward: convertBalance(response.remaining_reward),
    unit_price: convertBalance(response.unit_price),
    active: response.active,
    minimumScore: Number(response.minimum_score),
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
    }
  | {
      moduleName: "subscription_manager";
      functionName: "subscribe" | "check_subscription";
    }
  | {
      moduleName: "mamu";
      functionName: "get_balance" | "get_balances" | "mint";
    };

export const functionAccessStringCreator = ({
  functionName,
  moduleName,
}: FunctionAccessStringCreatorProps):
  | `${string}::${string}::${string}`
  | false => {
  let accountAddress =
    process.env.NEXT_PUBLIC_MODULE_ADDRESS_WITH_0X_PREFIX || "";

  if (!accountAddress) {
    console.error("Account address not found from .env file");
    return false;
  }

  return `${accountAddress}::${moduleName}::${functionName}`;
};

export function convertBalance(rawAmount: number | string, toRaw?: boolean) {
  const precisionConstant = process.env.NEXT_PUBLIC_DECIMAL_PRECISION || "";

  if (!precisionConstant) {
    console.error("Precision constant not found from .env file");
    return 0;
  }

  // This defines how many decimal places the number will have.
  const numberedPrecisionConstant = Number(precisionConstant);

  // This is the number we want to format
  const numberedRawAmount = Number(rawAmount);

  if (toRaw) {
    return numberedRawAmount * Math.pow(10, numberedPrecisionConstant);
  }

  return numberedRawAmount / Math.pow(10, numberedPrecisionConstant);
}
