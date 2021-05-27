import * as functions from 'firebase-functions';
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

    if (secret !== adminConfig.docusaurus.auth) {
      functions.logger.error('Detected access with invalid token');
      return response.status(401).json({
        message: 'Invalid token',
      });
    }

    if (request.method !== 'PUT') {
      return response.status(405).json({
        message: `Please use PUT method`,
      });
    }

    const body = await request.body;
    if (Object.keys(body).length === 0) {
      return response.status(500).json({
        message: `Please specify body`,
      });
    }

    const parsedBody = JSON.parse(body) as UpdateBody;

    if (!parsedBody.committer) {
      return response.status(500).json({
        message: `Please specify committer`,
      });
    }

    if (!parsedBody.message) {
      return response.status(500).json({
        message: `Please specify message`,
      });
    }

    if (!parsedBody.sha) {
      return response.status(500).json({
        message: `Please specify sha`,
      });
    }

    if (!parsedBody.content) {
      return response.status(500).json({
        message: `Please specify content`,
      });
    }

    if (!parsedBody.path) {
      return response.status(500).json({
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

    const api = `https://api.github.com/repos/aelyone/aelyone-github-api-test/contents${parsedBody.path}`;
    // 改行を直してからエンコード

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
            functions.logger.warn(
              `Found conflict with previous file: ${parsedBody.path} (prev:${prev.sha} / req:${parsedBody.sha})`,
            );
            return response.status(409).json({
              message: `Found conflict with previous file`,
            });
          } else {
            functions.logger.info(`Updating ${parsedBody.path}`);
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
        functions.logger.debug(JSON.stringify(postOptions.body));

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
              functions.logger.warn(`Conflict: ${parsedBody.path}`);
              return response.status(409).json({
                message: `Conflict`,
              });
            }

            return response.status(res.status).json({
              message: res.statusText,
            });
          })
          .catch((e) => {
            return response.status(500).json({ error: e, message: `Error on updating file` });
          });
      })
      .catch((e) => {
        return response
          .status(500)
          .json({ error: e, messageFromFunction: `Error on fetching file` });
      });
  });

export default updateFile;
