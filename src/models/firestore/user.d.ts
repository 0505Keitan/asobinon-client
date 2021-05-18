export interface UserImage {
  alt: string | null;
  src: string;
  filename: string;
  uploadedTimeStamp: firebase.firestore.FieldValue;
  nsfw: boolean;
}
