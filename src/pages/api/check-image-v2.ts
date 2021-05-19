import { NextApiRequest, NextApiResponse } from 'next';

export default async function checkImage(request: NextApiRequest, response: NextApiResponse) {
  const secret = request.headers.authorization as string | undefined;
  const src = request.query.src as string | undefined;
  const alt = request.query.alt as string | undefined;
  const uid = request.query.uid as string | undefined;

  if (!secret || secret !== process.env.FUNCTIONS_AUTH) {
    return response.status(401).json({
      message: 'Invalid token',
    });
  }

  if (!src || !src.includes('firebasestorage.googleapis.com')) {
    return response.status(500).json({
      message: 'Invalid filename',
    });
  } else {
    // filenameはhttps://firebasestorage.googleapis.com/v0/b/markdown-gaming.appspot.com/o/images%2Fuserupload%2FXXXX%2FXXXX.jpg?alt=media&token=XXXXX

    return await fetch(
      `${process.env.FUNCTIONS_URL}/uploader-nsfwCheckV2?alt=${alt ?? ''}&src=${src ?? ''}&uid=${
        uid ?? ''
      }`,
      {
        method: 'GET',
        headers: {
          Authorization: secret,
        },
      },
    )
      .then(async (res) => {
        if (res.ok) {
          const result = await res.json();
          return response.status(200).json(result);
        }
        return response.status(res.status).json({ message: res.statusText });
      })
      .catch((e) => {
        console.error(e);
        return response.status(500).json({ message: JSON.stringify(e) });
      });
  }
}
