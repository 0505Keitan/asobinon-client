import { NsfwLevel, NsfwResult } from '@/models/nsfw';

const nsfwChecker = async (url: string): Promise<NsfwResult> => {
  let level: NsfwLevel = 0;
  const result: NsfwResult['detail'] = await fetch(
    `${process.env.HTTPS_URL}/api/check-image?filename=${url}`,
    {
      headers: {
        Authorization: process.env.FUNCTIONS_AUTH ?? '',
      },
    },
  )
    .then((res) => {
      return res.json();
    })
    .catch((e) => console.error(e));
  if (result) {
    if (result?.adult == 'VERY_LIKELY' || result?.racy == 'VERY_LIKELY') {
      level = 3;
    }
    if (result?.adult == 'LIKELY' || result.racy == 'LIKELY') {
      level = 2;
    }
    if (result?.adult == 'POSSIBLE' || result.racy == 'POSSIBLE') {
      level = 1;
    }
  }

  return {
    detail: result,
    level: level,
  };
};

export default nsfwChecker;
