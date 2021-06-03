import * as functions from 'firebase-functions';
import { AdminConfig } from '../models/admin-config';
const adminConfig = functions.config() as AdminConfig;

import { COLLECTION_FEEDBACK_V2, REPLACE_SLASH } from '../lib/firestore';
import { Feedback } from '../models/feedback';

const getAllFeedback = functions
  .region('asia-northeast1')
  .https.onRequest(async (request, response: any) => {
    const secret = request.headers.authorization as string;

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

    try {
      const dataArray = await COLLECTION_FEEDBACK_V2.orderBy('good', 'desc')
        .get()
        .then((query) => {
          return query.docs.map((doc) => {
            const data = doc.data() as Feedback;
            return {
              ...data,
              // パスが付いていないのでここで追加する
              path: doc.id.replace(REPLACE_SLASH, '/'),
            };
          });
        });
      return response.status(200).json(dataArray);
    } catch (e) {
      functions.logger.error(e);
    }
  });

export default getAllFeedback;
