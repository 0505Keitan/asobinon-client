import * as admin from 'firebase-admin';
export const COLLECTION_FEEDBACK_V2 = admin.firestore().collection('feedback_v2');
export const REPLACE_SLASH = '_(slash)_';
