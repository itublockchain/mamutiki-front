export type AIAnalysisResponse = {
  campaignId: number;
  contentLength: number;
  ipfsCID: string;
  score: number;
  keyForDecryption: string;
  signature: string;
};
