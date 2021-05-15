import * as functions from "firebase-functions";
import { MailJet } from "../lib/mailjet";
import { AdminConfig } from "../models/admin-config";

const adminConfig = functions.config() as AdminConfig;

const contactWithMailjet = functions
  .region("asia-northeast1")
  .https.onRequest(async (request, response: any) => {
    const secret = request.headers.authorization as string;

    if (secret !== adminConfig.docusaurus.auth) {
      functions.logger.error("Detected access with invalid token");
      return response.status(401).json({
        message: "Invalid token",
      });
    }

    if (request.method !== "POST") {
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
    const parsedBody = JSON.parse(body);

    functions.logger.info("Posting contact mail");
    const noticeOptions = {
      title: `新しい問い合わせ: ${parsedBody.title ?? "タイトル不明"}`,
      content: `${
        parsedBody.text ?? "本文なし"
      }\n\n---\n返信用メールアドレス: ${
        parsedBody.email.length > 0 ? parsedBody.email : "指定なし"
      }`,
      from: adminConfig.mail.sender ?? "functions-from-not-set@ima.icu",
      fromName: "Markdown Gaming 運営チーム・お問い合わせ部門",
      to: adminConfig.mail.to ?? "sasigume+mdtonotset@gmail.com",
    };

    // まずお知らせメールを送信
    await MailJet(noticeOptions)
      .then(async () => {
        functions.logger.info("Contact notice mail is successfully sent");

        // 返信用メアドがあれば返信
        if (parsedBody.email.length > 0) {
          const thanksOptions = {
            title: "【Markdown Gaming】お問い合わせについてのご案内",
            content: `お問い合わせいただきありがとうございます。返信までお時間をいただくかもしれませんが、ご了承ください。\n\nお問い合わせ内容: \n\n---\nイマイク代表 安藤 諒 (Ryo Ando)\nsasigume@gmail.com`,
            from: adminConfig.mail.sender ?? "functions-from-not-set@ima.icu",
            fromName: "Markdown Gaming 運営チーム・お問い合わせ部門",
            to: parsedBody.email,
          };

          await MailJet(thanksOptions)
            .then(() => {
              functions.logger.info("Thanks mail is successfully sent");
              return response.status(200).json({
                message: "Notice and thanks mails are successfully sent",
              });
            })
            .catch((e) => {
              return response.status(500).json({
                message: `Stringified error: ${JSON.stringify(e)}`,
              });
            });
        } else {
          functions.logger.info("Notice mail is successfully sent");
          return response.status(200).json({
            message: "Notice mail is successfully sent",
          });
        }
      })
      .catch((e: any) => {
        functions.logger.error(e);
        return response.status(500).json({
          message: `Stringified error: ${JSON.stringify(e)}`,
        });
      });
  });

exports.contactWithMailjet = contactWithMailjet;
