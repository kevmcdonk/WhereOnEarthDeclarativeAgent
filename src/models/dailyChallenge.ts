import { DailyChallengeEntry } from "./dailyChallengeEntry";
import { DailyChallengeImage } from "./dailyChallengeImage";

 export enum DailyChallengeStatus
 {
     NotSet,
     Choosing,
     Guessing,
     Completed
 }

export interface DailyChallenge {
  id: string;
  objType: string;
  imageInfo: DailyChallengeImage;
  text: string;
  photoUrl: string;
  extractedLocation: string;
  longitude: number;
  latitude: number;
  publishedTime: Date;
  entries: DailyChallengeEntry[];
  serializedEntries: string;
  resultSet: boolean;
  winnerGuess: string;
  winnerName: string;
  distanceToEntry: number;
  currentStatus: DailyChallengeStatus;
  serializableCurrentStatus: string;
}