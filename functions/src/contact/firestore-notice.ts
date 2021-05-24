import * as functions from 'firebase-functions';
import { MailJet } from '../lib/mailjet';
import { AdminConfig } from '../models/admin-config';
import { UserImage } from '../models/userimage';

const adminConfig = functions.config() as AdminConfig;

const firestoreNotice = functions
  .region('asia-northeast1')
  .firestore.document('users/{uid}/images/{imageId}')
  .onWrite((change, context) => {
    const data = change.after.data() as UserImage;
    const uid = context.params.uid;
    if (data.nsfw > 1) {
      const userImageUrl = `https://client.asobinon.org/authenticated/images?uid=${uid}`;
      const storageAdminUrl = `https://console.firebase.google.com/project/asobinon-org/storage/asobinon-org.appspot.com/files~2Fimages~2Fuserupload~2F${uid}`;
      functions.logger.info('Posting nsfw notice mail');
      const noticeOptions = {
        title: `【ASOBINON】NSFWレベル${data.nsfw}の画像が投稿されました`,
        content: `ユーザー: ${uid}\n\nこのユーザーの画像: ${userImageUrl}\n\n画像: ${data.src}\n\n管理: ${storageAdminUrl}`,
        from: adminConfig.mail.sender ?? 'functions-from-not-set@aely.one',
        fromName: 'ASOBINON 運営チーム・お問い合わせ部門',
        to: adminConfig.mail.to ?? 'sasigume+mdtonotset@gmail.com',
      };

      MailJet(noticeOptions).then(() => {
        functions.logger.info('Job complete');
      });
    }

    return null;
  });

export default firestoreNotice;
