import { NextApiRequest, NextApiResponse } from "next";

export default async function send(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const secret = request.headers.authorization as string | undefined;

  if (!secret || secret !== process.env.FUNCTIONS_AUTH) {
    return response.status(401).json({
      message: "Invalid token",
    });
  }

  return await fetch(
    `${process.env.FUNCTIONS_URL}/contact-contactWithMailjet`,
    {
      method: "POST",
      body: request.body ?? "",
      headers: {
        Authorization: secret,
      },
    }
  )
    .then((res) => {
      if (res.ok) {
        return response.status(200).json(res);
      }
      return response.status(res.status).json({ message: res.statusText });
    })
    .catch((e) => {
      return response.status(500).json({ message: JSON.stringify(e) });
    });
}
