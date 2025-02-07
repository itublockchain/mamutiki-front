/**
 * Represents the structure of a campaign document.
 */
export type CampaignDocData = {
  /**
   * The title of the campaign.
   */
  title: string;

  /**
   * A brief description of the campaign and its purpose.
   */
  description: string;

  /**
   * The sector to which the campaign belongs.
   */
  sector: CampaignSector;

  /**
   * The offer amount for the campaign, typically a reward or funding amount.
   */
  unitPrice: number;

  /**
   * The total number of tokens that have been staked for the campaign.
   */
  stakedBalance: number;

  /**
   * The remaining number of tokens that can be staked for the campaign.
   */
  remainingStatkedBalance: number;

  /**
   * The currency in which the offer is provided.
   * Currently, only USDT (Tether) is supported.
   */
  offerCurrency: "USDT";

  /**
   * A unique identifier for the campaign.
   */
  id: string;

  /**
   * The unique identifier of the user who created the campaign.
   */
  creatorId: string;

  /**
   * The timestamp (in milliseconds) when the campaign was created.
   */
  creationTs: number;

  /**
   * The minimum required data quality score for submissions, represented as a percentage (0-100).
   */
  minDataQuality: number;

  /**
   * The minimum amount of data required for the campaign to be considered valid.
   */
  minDataQuantity: number;

  /**
   * The status of campaign.
   */
  status: CampaignStatus;

  submitCount: number;
};

export type CampaignStatus = "open" | "canceled" | "finished";

export type CampaignSector =
  | "health"
  | "finance"
  | "agriculture"
  | "education"
  | "other";
