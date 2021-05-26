export interface AdminConfig {
  mailjet: {
    key: string;
    secret: string;
  };
  mail: {
    notice: string;
    to: string;
    sender: string;
  };
  docusaurus: {
    auth: string;
  };
  github: {
    editortoken: string;
  };
}
