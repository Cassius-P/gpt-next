import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai-streams/node";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== "POST") {
    res.status(401).json({ error: "Method not allowed" });
    return;
  }

  if (!req.body || !req.body.message) {
    res.status(400).json({ error: "Bad request" });
    return;
  }

  const stream = await OpenAI(
    "completions",
    {
      model: "text-davinci-003",
      prompt: "Write a happy sentence.\n\n",
      max_tokens: 60,
      temperature: 0,
      top_p: 1,
      n: 1,
    }
  );

  stream.pipe(res);
}