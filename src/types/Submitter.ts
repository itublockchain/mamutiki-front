export type SubmitterDocData = {
  /**
   * same with UID
   */
  id: string;
  /**
   * Optional descriptive name
   */
  name?: string;
  /**
   * Optional bio
   */
  bio?: string;
  /**
   * Optional profile picture
   */
  profilePictureCID?: string;

  totalSubmitterDataLength: number;
  totalSubmittedDataCount: number;
  totalDataQualityScore: number;

  averageDataQualityScore: number;

  creationTs: number;
};
