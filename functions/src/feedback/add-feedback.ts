import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { AdminConfig } from '../models/admin-config';
const adminConfig = functions.config() as AdminConfig;
import fetch from 'node-fetch';
import { GetResponse } from '../models/github';
import { COLLECTION_FEEDBACK_V2, REPLACE_SLASH } from '../lib/firestore';

const addFeedback = functions
  .region('asia-northeast1')
  .https.onRequest(async (request, response: any) => {
    const secret = request.headers.authorization as string;
    const path = request.query.path as string | undefined;
    const value = request.query.value as string | undefined;

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

    if (!path) {
      return response.status(422).json({
        message: `Please specify path`,
      });
    }

    // b記号で単語を完全一致させる
    if (!value || !value.match(/\b(good|bad)\b/)) {
      return response.status(422).json({
        message: `Please specify "good" or "bad" for value query`,
      });
    }

    const afterSlash = path.substring(1);
    const api = `https://api.github.com/repos/sasigume/asobinon/contents/${encodeURIComponent(
      afterSlash,
    )}`;

    await fetch(api, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminConfig.github.editortoken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })
      .then(async (res) => {
        const data: GetResponse = await res.json();
        if (res.ok) {
          // スラッシュは使えないのでとりあえず置換する
          const docName = path.replace(/\//g, REPLACE_SLASH);
          const docRef = COLLECTION_FEEDBACK_V2.doc(docName);

          // GOOD/BADでフィールドを切り替える
          const field = (isGood: boolean) => {
            if (isGood) {
              return {
                ...fieldBase,
                good: admin.firestore.FieldValue.increment(1),
              };
            } else {
              return {
                ...fieldBase,
                bad: admin.firestore.FieldValue.increment(1),
              };
            }
          };

          // サブコレクション配下に、shaごとに同じ形式のデータを書き込む (#12)
          const docShaSubDoc = docRef.collection('version').doc(data.sha ?? 'INVALID_SHA');
          const fieldBase = {
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
          };

          try {
            if (value == 'good') {
              await docRef.set(field(true), { merge: true });
              await docShaSubDoc.set(field(true), { merge: true });
            } else {
              await docRef.set(field(false), { merge: true });
              await docShaSubDoc.set(field(false), { merge: true });
            }
          } catch (e) {
            functions.logger.error(e);
          }

          return response.status(200).json({ message: `Feedback added` });
        } else {
          return response
            .status(res.status)
            .json({ message: `Response from GH API :${JSON.stringify(data)}` });
        }
      })
      .catch((e) => {
        functions.logger.debug(e);
        return response
          .status(500)
          .json({ message: `Error on fetching GH API: ${JSON.stringify(e)}` });
      });
  });

export default addFeedback;
