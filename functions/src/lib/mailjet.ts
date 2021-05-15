import * as functions from "firebase-functions";
import { AdminConfig } from "../models/admin-config";
const adminConfig = functions.config() as AdminConfig;

interface Options {
  title: string;
  content: string;
  from: string;
  fromName: string;
  to: string;
}

export async function MailJet(options: Options) {
  const mailjet = require("node-mailjet").connect(
    adminConfig.mailjet.key,
    adminConfig.mailjet.secret
  );

  var sendEmail = mailjet.post("send");

  var emailData = {
    FromEmail: options.from,
    FromName: options.fromName,
    Subject: options.title,
    "Text-part": options.content,
    Recipients: [{ Email: options.to }],
  };
  type Error = {
    ErrorMessage: string;
  };
  sendEmail
    .request(emailData)
    .then(functions.logger.info("Mail send to " + options.to))
    .catch(function (error: Error) {
      throw new Error(error.ErrorMessage);
    });
}
