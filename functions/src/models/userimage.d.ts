import * as admin from 'firebase-admin';

export interface UserImage {
  alt: string | null;
  src: string;
  uploadedTimeStamp: admin.firestore.FieldValue;
  nsfw: 0 | 1 | 2 | 3;
}
