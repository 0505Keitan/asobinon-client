import { NsfwLevel } from '../nsfw';

export interface UserImage {
  alt: string | null;
  src: string;
  uploadedTimeStamp: firebase.firestore.FieldValue;
  nsfw: NsfwLevel;
}
