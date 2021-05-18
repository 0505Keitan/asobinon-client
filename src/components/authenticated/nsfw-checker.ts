type nsfwType = 'UNKNOWN' | 'VERY_UNLIKELY' | 'UNLIKELY' | 'POSSIBLE' | 'LIKELY' | 'VERY_LIKELY';
type nsfwResult = {
  adult: nsfwType;
  spoof: nsfwType;
  medical: nsfwType;
  violence: nsfwType;
  racy: nsfwType;
  adultConfidence: number;
  spoofConfidence: number;
  medicalConfidence: number;
  violenceConfidence: number;
  racyConfidence: number;
  nsfwConfidence: number;
} | null;

const nsfwChecker = async (url: string) => {
  const result: nsfwResult = await fetch(
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
    if (result?.adult == 'VERY_LIKELY') {
      return 3;
    }
    if (result?.adult == 'LIKELY') {
      return 2;
    }
    if (result?.adult == 'POSSIBLE') {
      return 1;
    }
    return 0;
  } else {
    return null;
  }
};

export default nsfwChecker;
