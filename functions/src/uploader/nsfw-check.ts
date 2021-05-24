const vision = require('@google-cloud/vision');
import * as functions from 'firebase-functions';
import { AdminConfig } from '../models/admin-config';
const adminConfig = functions.config() as AdminConfig;
// Creates a client
const client = new vision.ImageAnnotatorClient();

const nsfwCheck = functions
  .region('asia-northeast1')
  .https.onRequest(async (request, response: any) => {
    const secret = request.headers.authorization as string;
    const filename = request.query.filename as string | undefined;

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

    if (!filename) {
      return response.status(500).json({
        message: 'Please specify filename',
      });
    }
    const bucketName = 'asobinon-org.appspot.com';

    // Performs safe search property detection on the remote file
    const [result] = await client.safeSearchDetection(`gs://${bucketName}/${filename}`);
    const detections = result.safeSearchAnnotation;

    return response.status(200).json(detections);
    /* console.log(`Adult: ${detections.adult}`);
    console.log(`Spoof: ${detections.spoof}`);
    console.log(`Medical: ${detections.medical}`);
    console.log(`Violence: ${detections.violence}`); */
  });

export default nsfwCheck;
