import { NextApiRequest, NextApiResponse } from 'next';

export default async function edit(request: NextApiRequest, response: NextApiResponse) {
  const secret = request.headers.authorization as string | undefined;
  // ここではFirebaseのIDトークンをそのまま送る
  return await fetch(`${process.env.FUNCTIONS_URL}/editor-updateFile`, {
    method: 'PUT',
    body: request.body ?? '',
    headers: {
      Authorization: secret ?? '',
    },
  })
    .then(async (res) => {
      if (res.ok) {
        return response.status(200).json(res);
      } else {
        const data = await res.json();
        return response.status(res.status).json({ message: data.message ?? res.statusText });
      }
    })
    .catch((e) => {
      return response.status(500).json({ message: JSON.stringify(e) });
    });
}
