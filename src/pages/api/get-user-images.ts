import { NextApiRequest, NextApiResponse } from 'next';

export default async function getUserImages(request: NextApiRequest, response: NextApiResponse) {
  const secret = request.headers.authorization as string | undefined;
  const uid = request.query.uid as string | undefined;
  const start = request.query.start as string | undefined;
  const limit = request.query.limit as string | undefined;

  if (!secret || secret !== process.env.FUNCTIONS_AUTH) {
    return response.status(401).json({
      message: 'Invalid token',
    });
  }

  const api = `${process.env.FUNCTIONS_URL}/uploader-getUserImages?uid=${uid}&start=${
    start ?? 0
  }&limit=${limit ?? 10}`;
  return await fetch(api, {
    method: 'GET',
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
