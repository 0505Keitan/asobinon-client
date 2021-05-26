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

    if (!parsedBody.path.startsWith('/')) {
      return response.status(500).json({
        message: `Path must starts with slash`,
      });
    }

    const api = `https://api.github.com/repos/aelyone/aelyone-github-api-test/contents${parsedBody.path}`;
    console.debug('API: ', api);
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
    await fetch(api)
      .then(async (res) => {
        const prev: GetResponse = await res.json();

        if (!prev.sha)
          functions.logger.info(` Creating new file because ${parsedBody.path} not found`);
        else functions.logger.info(`Updating ${parsedBody.path}`);

        const postOptions = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminConfig.github.editortoken}`,
            Accept: 'application/vnd.github.v3+json',
          },
          body: JSON.stringify(requestBody(prev.sha)),
        };

        await fetch(api, postOptions)
          .then(async (res) => {
            const data = (await res.json()) as PostResponse;
            if (data.content && data.content.html_url !== undefined) {
              functions.logger.info(
                `Successfully updated ${parsedBody.path} (${parsedBody.message})`,
              );
              return response.status(200).json({
                message: `Updated file: ${data.content.html_url}`,
              });
            } else {
              return response.status(500).json({
                message: data.message,
              });
            }
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