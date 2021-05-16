export const SITE_NAME = 'マークダウンゲーミング';
export const SITE_URL = 'mdg.ima.icu';
export const TWITTER_ID = 'markdowngaming';
export const SITE_DESC = 'GitHubで管理するゲーム攻略サイト';
export const SITE_FULL_URL =
  process.env.HTTPS_URL ?? 'https://' + process.env.VERCEL_URL ?? 'https://mdg.ima.icu';

export const VERCEL_GITHUB_REPOSITORY_TOP =
  'https://github.com/' +
  (process.env.VERCEL_GIT_REPO_OWNER ?? '') +
  '/' +
  (process.env.VERCEL_GIT_REPO_SLUG ?? '');
export const VERCEL_LAST_COMMIT =
  VERCEL_GITHUB_REPOSITORY_TOP + '/commit/' + (process.env.VERCEL_GIT_COMMIT_SHA ?? '');
export const VERCEL_LAST_COMMIT_MESSAGE = process.env.VERCEL_GIT_COMMIT_MESSAGE ?? '';
