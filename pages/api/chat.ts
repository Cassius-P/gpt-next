import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai-streams/node";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== "POST") {
    res.status(401).json({ error: "Method not allowed" });
    return;
  }

  console.log("Chat message received", req.body)

  let message = JSON.parse(req.body)
  if (!req.body || !message?.content) {
    res.status(400).json({ error: "Bad request" });
    return;
  }


}