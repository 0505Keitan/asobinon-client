import { NextApiRequest, NextApiResponse } from 'next';

export default async function checkImage(request: NextApiRequest, response: NextApiResponse) {
  const secret = request.headers.authorization as string | undefined;

  if (!secret || secret !== process.env.FUNCTIONS_AUTH) {
    console.error('Invalid token');
    return response.status(401).json({
      message: 'Invalid token',
    });
  }

  const api = `${process.env.FUNCTIONS_URL}/uploader-nsfwCheckV2`;
  return await fetch(api, {
    method: 'POST',
    body: request.body ?? '',
    headers: {
      Authorization: secret,
    },
  })
    .then(async (res) => {
      if (res.ok) {
        const result = await res.json();
        return response.status(200).json(result);
      } else {
        return response.status(res.status).json({ message: res.statusText });
      }
    })
    .catch((e) => {
      console.error(e);
      return response.status(500).json({ message: JSON.stringify(e) });
    });
}
