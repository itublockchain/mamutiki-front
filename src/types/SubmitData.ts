import { CampaignSector } from "./Campaign";

export type SubmittedDataDocData =
  | {
      sector: CampaignSector;
      id: string;
      creatorId: string;
      creationTs: number;
      dataQuality: number;
      dataLength: number;
      campaignId: string;
      dataCID: string,
      status: "pending" | "rejected";
    }
  | {
      sector: CampaignSector;
      id: string;
      creatorId: string;
      creationTs: number;
      dataQuality: number;
      dataLength: number;
      campaignId: string;
      dataCID:string,
      status: "approved";
      earnedTokenCount: number;
    };
