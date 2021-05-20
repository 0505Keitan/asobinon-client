const vision = require('@google-cloud/vision');
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { AdminConfig } from '../models/admin-config';
import { ApiResult, NsfwLevel } from '../models/nsfw';
import { UserImage } from '../models/userimage';
const adminConfig = functions.config() as AdminConfig;
const client = new vision.ImageAnnotatorClient();

interface Body {
  src: string;
  alt: string | null;
  uid: string;
}

const nsfwCheckV2 = functions
  .region('asia-northeast1')
  .https.onRequest(async (request, response: any) => {
    const secret = request.headers.authorization as string;

    if (secret !== adminConfig.docusaurus.auth) {
      functions.logger.error('Detected access with invalid token');
      return response.status(401).json({
        message: 'Invalid token',
      });
    }

    if (request.method !== 'POST') {
      return response.status(405).json({
        message: `Please use POST method`,
      });
    }

    const body = await request.body;
    if (Object.keys(body).length === 0) {
      return response.status(500).json({
        message: `Please specify body`,
      });
    }
    const parsedBody = JSON.parse(body) as Body;

    if (!parsedBody.uid || !parsedBody.src) {
      return response.status(500).json({
        message: 'Please specify all of them: uid, src',
      });
    }
    const basePath = 'https://firebasestorage.googleapis.com/v0/b/markdown-gaming.appspot.com/o/';

    const storagePath = decodeURIComponent(parsedBody.src.replace(basePath, '').split('?')[0]);
    const bucketName = 'markdown-gaming.appspot.com';
    const detect = `gs://${bucketName}/${storagePath}`;
    let messages: string[] = [];
    let level: NsfwLevel = 0;
    let adultLevel = 0;
    let racyLevel = 0;
    try {
      const [result] = await client.safeSearchDetection(detect);
      const detections = result.safeSearchAnnotation as ApiResult;

      if (detections.adult == 'POSSIBLE') {
        messages.push('アダルト度1');
        adultLevel = 1;
      }
      if (detections.adult == 'LIKELY') {
        messages.push('アダルト度2');
        adultLevel = 2;
      }
      if (detections.adult == 'VERY_LIKELY') {
        messages.push('アダルト度3');
        adultLevel = 3;
      }

      // racyは露出が多いとすぐ上がるのでadultより1つ下げる
      if (detections.racy == 'POSSIBLE') {
        messages.push('露出度1');
        racyLevel = 0;
      }
      if (detections.racy == 'LIKELY') {
        messages.push('露出度2');
        racyLevel = 1;
      }
      if (detections.racy == 'VERY_LIKELY') {
        messages.push('露出度3');
        racyLevel = 2;
      }

      // 低い方が最終的なNSFWレベルになる
      level = Math.round((adultLevel + racyLevel) / 2) as NsfwLevel;
    } catch (e) {
      functions.logger.error(e);
    }
    const userRef = admin.firestore().collection('users').doc(parsedBody.uid);
    const userSubCollectionRef = userRef.collection('images');

    const userData = {
      // 上はNSFW枚数、下は累計NSFWレベル
      picCount: admin.firestore.FieldValue.increment(1),
      nsfwPicCount: admin.firestore.FieldValue.increment(level > 0 ? 1 : 0),
      nsfwLevelCount: admin.firestore.FieldValue.increment(level),
    };
    const registerData: UserImage = {
      alt: parsedBody.alt && parsedBody.alt?.length > 0 ? parsedBody.alt : null,
      src: parsedBody.src,
      date: new Date(),
      nsfw: level,
    };
    return await userRef
      .set(userData, { merge: true })
      .then(() => {
        userSubCollectionRef.add(registerData).then(() => {
          return response.status(200).json({
            messages: messages,
            level: level,
            searched: detect,
          });
        });
      })
      .catch((e) => {
        functions.logger.error(e);
        return response.status(500).json({
          message: e,
        });
      });
  });

export default nsfwCheckV2;
