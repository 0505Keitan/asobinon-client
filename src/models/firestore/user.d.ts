export interface UserImage {
  alt: string | null;
  src: string;
  filename: string;
  uploadedTimeStamp: firebase.firestore.FieldValue;
  nsfw: 0 | 1 | 2 | 3;
}
