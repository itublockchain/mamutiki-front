export type CreateCampaignFunctionInput = {
  title: string;
  description: string;
  /**
   * AI prompt for the campaign for the AI to check data.
   */
  dataSpec: string;

  unitPrice: number;

  rewardPool: number;

  publicKeyForEncryption: number[];
};

export type GetCampaignFunctionInput = {
  campaignId: string;
};

export type GetCampaignFunctionResponse = {
  id: number;
  title: string;
  description: string;
  creator: string;
  data_spec: string;
  reward_pool: number;
  remaining_reward: number;
  unit_price: number;
  active: boolean;
};

export type ListAllCampaignsFunctionResponse = GetCampaignFunctionResponse[];

// campaign_id, data_count, store_key, score, sign
export type AddContributionFunctionInput = {
  campaignId: number;
  dataCount: number;
  store_key: string;
  score: string;
  keyForDecryption: string;
  sign: string;
};

export type Contribution = {
  campaignId: number;
  contributor: string;
  dataCount: number;
  storeCid: string;
  score: number;
  keyForDecryption: string;
};

export type GetCampaignFunctionContractResponse = {
  id: string;
  title: string;
  description: string;
  creator: string;
  prompt: string;
  reward_pool: string;
  remaining_reward: string;
  unit_price: string;
  active: boolean;
};
