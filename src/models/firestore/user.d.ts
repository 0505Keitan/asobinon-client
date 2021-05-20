import { NsfwLevel } from '../nsfw';

export interface UserImage {
  alt: string | null;
  src: string;
  date: Date;
  nsfw: NsfwLevel;
}
