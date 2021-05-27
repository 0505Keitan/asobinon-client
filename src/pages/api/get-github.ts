import { NextApiRequest, NextApiResponse } from 'next';

export default async function getGithub(request: NextApiRequest, response: NextApiResponse) {
  const path = request.query.path as string | undefined;
  const secret = request.headers.authorization as string | undefined;

  if (!secret || secret !== process.env.FUNCTIONS_AUTH) {
    return response.status(401).json({
      message: 'Invalid token',
    });
  }
  const api = `${process.env.FUNCTIONS_URL}/editor-fetchGitHub?path=${encodeURIComponent(
    path ?? '',
  )}`;
  return await fetch(api, {
    headers: {
      Authorization: secret,
    },
  })
    .then(async (res) => {
      const data = await res.json();
      if (res.ok) {
        return response.status(200).json(data);
      } else {
        return response.status(res.status).json({ message: data.message ?? res.statusText });
      }
    })
    .catch((e) => {
      return response.status(500).json({ message: JSON.stringify(e) });
    });
}
