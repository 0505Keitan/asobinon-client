import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { AdminConfig } from '../models/admin-config';
import { UpdateBody } from '../models/editor';
const adminConfig = functions.config() as AdminConfig;
import fetch from 'node-fetch';
import { GetResponse, PostResponse } from '../models/github';
import { encode } from 'js-base64';

const updateFile = functions
  .region('asia-northeast1')
  .https.onRequest(async (request, response: any) => {
    const secret = request.headers.authorization as string;

    // https://github.com/firebase/functions-samples/blob/master/authorized-https-endpoint/functions/index.js
    // トークンを確認
    if (
      (!secret || !secret.startsWith('Bearer ')) &&
      !(request.cookies && request.cookies.__session)
    ) {
      functions.logger.error('Detected invalid access');
      return response.status(403).json({ message: 'Unauthorized' });
    }

    let idToken;
    if (secret && secret.startsWith('Bearer ')) {
      idToken = secret.split('Bearer ')[1];
    } else if (request.cookies) {
      idToken = request.cookies.__session;
    } else {
      // No cookie
      functions.logger.error('Detected invalid access');
      return response.status(403).json({ message: 'Unauthorized' });
    }

    try {
      await admin.auth().verifyIdToken(idToken);
    } catch (error) {
      functions.logger.error('Error while verifying Firebase ID token');
      return response.status(403).json({ message: 'Unauthorized' });
    }

    if (request.method !== 'PUT') {
      return response.status(405).json({
        message: `Please use PUT method`,
      });
    }

    const body = await request.body;
    if (Object.keys(body).length === 0) {
      return response.status(422).json({
        message: `Please specify body`,
      });
    }

    const parsedBody = JSON.parse(body) as UpdateBody;

    if (!parsedBody.committer) {
      return response.status(422).json({
        message: `Please specify committer`,
      });
    }

    if (!parsedBody.message) {
      return response.status(422).json({
        message: `Please specify message`,
      });
    }

    if (!parsedBody.sha) {
      return response.status(500).json({
        message: `Please specify sha`,
      });
    }

    if (!parsedBody.content) {
      return response.status(422).json({
        message: `Please specify content`,
      });
    }

    if (!parsedBody.path) {
      return response.status(422).json({
        message: `Please specify path`,
      });
    }

    if (typeof parsedBody.path === 'string' && parsedBody.path?.split('.').pop() !== 'md') {
      return response.status(403).json({
        message: `This file is not allowed to edit`,
      });
    }

    if (!parsedBody.path.startsWith('/')) {
      return response.status(500).json({
        message: `Path must starts with slash`,
      });
    }

    // スラッシュがエンコードされないように
    const afterSlash = parsedBody.path.substring(1);

    const api = `https://api.github.com/repos/sasigume/asobinon/contents/${encodeURIComponent(
      afterSlash,
    )}`;
    // 本文をエンコード
    const encodedContent = encode(parsedBody.content);

    // shaがあるかないかで分岐する
    const requestBody = (sha: string | null) => {
      if (sha) {
        return {
          ...parsedBody,
          content: encodedContent,
          sha,
        };
      } else {
        return {
          ...parsedBody,
          content: encodedContent,
        };
      }
    };

    // ファイルが存在するか確認
    await fetch(api, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminConfig.github.editortoken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })
      .then(async (res) => {
        const prev: GetResponse = await res.json();

        if (!prev.sha) {
          // 見つからない場合前のsha取れなくて厄介なことになる
          // エディタはファイル作成を想定していない
          return response.status(404).json({
            message: `File not found (probably removed)`,
          });
        } else {
          if (prev.sha != parsedBody.sha) {
            // 矛盾してる(クライアントが最初にGETしてからファイル変わった
            return response.status(409).json({
              message: `Found conflict with previous file`,
            });
          }
        }

        const postOptions = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminConfig.github.editortoken}`,
            Accept: 'application/vnd.github.v3+json',
          },
          body: JSON.stringify(requestBody(prev.sha)),
        };

        // shaが違うと 409 Conflictになる
        await fetch(api, postOptions)
          .then(async (res) => {
            const data = (await res.json()) as PostResponse;
            // エディタはファイル作成を想定していない
            // が、結果的に201ならそれでいいことにする
            if (res.status == 201) {
              functions.logger.info(
                `Successfully created ${parsedBody.path} (${parsedBody.message})`,
              );
              return response.status(201).json({
                message: `Created file: ${data.content.html_url}`,
              });
            }
            // updated is 200
            if (res.status == 200) {
              functions.logger.info(
                `Successfully updated ${parsedBody.path} (${parsedBody.message})`,
              );
              return response.status(200).json({
                message: `Updated file: ${data.content.html_url}`,
              });
            }

            // conflict is 409
            if (res.status == 409) {
              return response.status(409).json({
                message: `Conflict`,
              });
            }

            return response.status(res.status).json({
              message: res.statusText,
            });
          })
          .catch((e) => {
            return response
              .status(500)
              .json({ message: `${JSON.stringify(e)} / Error on updating file` });
          });
      })
      .catch((e) => {
        return response
          .status(500)
          .json({ message: `${JSON.stringify(e)} / Error on updating file` });
      });
  });

export default updateFile;
