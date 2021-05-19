const vision = require('@google-cloud/vision');
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { AdminConfig } from '../models/admin-config';
import { ApiResult, NsfwLevel } from '../models/nsfw';
import { UserImage } from '../models/userimage';
const adminConfig = functions.config() as AdminConfig;
const client = new vision.ImageAnnotatorClient();

const nsfwCheckV2 = functions
  .region('asia-northeast1')
  .https.onRequest(async (request, response: any) => {
    const secret = request.headers.authorization as string;
    const src = request.query.src as string | undefined;
    const uid = request.query.uid as string | undefined;
    const alt = request.query.alt as string | undefined;

    if (secret !== adminConfig.docusaurus.auth) {
      functions.logger.error('Detected access with invalid token');
      return response.status(401).json({
        message: 'Invalid token',
      });
    }

    if (request.method !== 'GET') {
      return response.status(405).json({
        message: `Please use GET method`,
      });
    }

    if (!uid || !src) {
      return response.status(500).json({
        message: 'Please specify all of them:uid, src',
      });
    }
    const path = decodeURI(
      src
        .replace('https://firebasestorage.googleapis.com/v0/b/markdown-gaming.appspot.com/o/', '')
        .replace(/\?(.+?)=(.+?)$/g, ''),
    );

    const bucketName = 'markdown-gaming.appspot.com';
    let messages: string[] = [];
    let level: NsfwLevel = 0;
    try {
      const [result] = await client.safeSearchDetection(`gs://${bucketName}/${path}`);
      const detections = result.safeSearchAnnotation as ApiResult;

      if (detections.adult == 'VERY_LIKELY') {
        messages.push('アダルト度3');
        level = 3;
      }
      if (detections.racy == 'VERY_LIKELY') {
        messages.push('卑猥度3');
        level = 3;
      }
      if (detections.adult == 'LIKELY') {
        messages.push('アダルト度2');
        level = 2;
      }
      if (detections.racy == 'LIKELY') {
        messages.push('卑猥度2');
        level = 2;
      }
      if (detections.adult == 'POSSIBLE') {
        messages.push('アダルト度1');
        level = 1;
      }
      if (detections.racy == 'POSSIBLE') {
        messages.push('卑猥度1');
        level = 1;
      }
    } catch (e) {
      functions.logger.error(e);
    }
    const userRef = admin.firestore().collection('users').doc(uid);
    const userSubCollectionRef = userRef.collection('images');

    const userData = {
      // 上はNSFW枚数、下は累計NSFWレベル
      picCount: admin.firestore.FieldValue.increment(1),
      nsfwPicCount: admin.firestore.FieldValue.increment(level > 0 ? 1 : 0),
      nsfwLevelCount: admin.firestore.FieldValue.increment(level),
    };
    const registerData: UserImage = {
      alt: alt ?? null,
      src: src,
      uploadedTimeStamp: admin.firestore.FieldValue.serverTimestamp(),
      nsfw: level,
    };
    userRef
      .set(userData, { merge: true })
      .then(() => {
        userSubCollectionRef.add(registerData);
      })
      .catch((e) => functions.logger.error(e));

    return response.status(200).json({
      messages: messages,
      level: level,
    });
  });

export default nsfwCheckV2;
