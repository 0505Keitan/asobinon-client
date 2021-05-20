import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { AdminConfig } from '../models/admin-config';
const adminConfig = functions.config() as AdminConfig;

const getUserImages = functions
  .region('asia-northeast1')
  .https.onRequest(async (request, response: any) => {
    const secret = request.headers.authorization as string;
    const uid = request.query.uid as string | undefined;
    const start = request.query.start as string | undefined;
    const limit = request.query.limit as string | undefined;

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

    if (!uid) {
      return response.status(500).json({
        message: `Please specify uid`,
      });
    }

    const userRef = admin.firestore().collection('users').doc(uid);
    const userSubCollectionRef = userRef.collection('images');

    return await userSubCollectionRef
      .get()
      .then(async (snapshot) => {
        if (!snapshot.empty) {
          // startAtは数字ではない！！！！いちいち「docs」から「どこから」を指定する必要がある
          const skipDoc = await userSubCollectionRef
            .orderBy('date', 'desc')
            .get()
            .then((snapshot) => {
              return snapshot.docs[parseInt(start ?? '0')];
            });
          const result = await userSubCollectionRef
            .orderBy('date', 'desc')
            .startAt(skipDoc)
            .limit(parseInt(limit ?? '10'))
            .get()
            .then((snapshot) => {
              functions.logger.debug(snapshot.size);
              return snapshot.docs.map((doc) => doc.data());
            });
          return response.status(200).json(result);
        } else {
          // 空なら
          response.status(200).json([]);
        }
      })
      .catch((e) => {
        functions.logger.error(e);
        return response.status(500).json({
          message: e,
        });
      });
  });

export default getUserImages;
