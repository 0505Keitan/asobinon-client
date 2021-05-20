export interface UserImage {
  alt: string | null;
  src: string;
  date: Date;
  nsfw: 0 | 1 | 2 | 3;
}
