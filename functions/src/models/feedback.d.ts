import * as admin from 'firebase-admin';
export interface Feedback {
  good?: number;
  bad?: number;
  lastUpdate: admin.firestore.FieldValue;
}
