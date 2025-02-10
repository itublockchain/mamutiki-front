export type CreateCampaignFunctionInput = {
  title: string;
  description: string;
  /**
   * AI prompt for the campaign for the AI to check data.
   */
  dataSpec: string;

  unitPrice: number;

  rewardPool: number;
};

export type GetCampaignFunctionInput = {
  campaignId: string;
};

export type GetCampaignFunctionResponse = {
  id: number;
  title: string;
  description: string;
  creator: string;
  data_spec: any;
  reward_pool: number;
  remaining_reward: number;
  unit_price: number;
  active: boolean;
};

export type ListAllCampaignsFunctionResponse = GetCampaignFunctionResponse[];

export type AddContributionFunctionInput = {
  campaignId: number;
  dataCount: number;
  data: string;
  verified: boolean;
};
