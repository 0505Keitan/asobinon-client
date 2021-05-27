import * as functions from 'firebase-functions';
import { AdminConfig } from '../models/admin-config';
const adminConfig = functions.config() as AdminConfig;
import fetch from 'node-fetch';
import { GetResponse } from '../models/github';

const fetchGitHub = functions
  .region('asia-northeast1')
  .https.onRequest(async (request, response: any) => {
    const secret = request.headers.authorization as string;
    const path = request.query.path as string | undefined;

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

    if (!path) {
      return response.status(500).json({
        message: `Please specify path`,
      });
    }

    const api = `https://api.github.com/repos/aelyone/aelyone-github-api-test/contents${path}`;

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

        return response.status(res.status).json(data);
      })
      .catch((e) => {
        return response.status(500).json({ error: e, message: `Error on fetching file` });
      });
  });

export default fetchGitHub;
