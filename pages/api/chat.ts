import type { NextApiRequest, NextApiResponse } from "next";
import {Message} from "@/models/Message";
export default async function handler (req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== "POST") {
    res.status(400).json({ error: "Method not allowed" });
    return;
  }

  console.log("Chat message received", req.body)

  if (!req.body || !req.body.messages) {
    res.status(400).json({ error: "Missing method field" });
    return;
  }

  let messages = req.body.messages

  if (messages.length == 0) {
    res.status(400).json({ error: "Bad request" });
    return;
  }

  messages = messages.map((m:Message) => {
    delete m.id;
    delete m.createdAt;
    delete m.state;
    delete m.conversationID;
      return m;
  })
/*
  const codeIndication = {
    content: "When indicating ``` a code block, define the language next to it like this ```js",
    role: "system"
  }

  messages = [codeIndication, ...messages];*/

  const openaiUrl = "https://api.openai.com/v1/chat/completions";
  const API_KEY = process.env.OPENAI_API_KEY;
  if (!API_KEY) {
    res.status(500).json({ error: "Internal Error" });
    return;
  }

  const parameters = {
    model: 'gpt-3.5-turbo',
    stream: true,
    messages,
    temperature: 0.5,
  };

  const openaiConfig = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(parameters),
  };

  try {
    const openaiResponse = await fetch(openaiUrl, openaiConfig);

    if (!openaiResponse.ok) {
      throw new Error(`Failed to fetch data from OpenAI. Status code: ${openaiResponse.status} : ${openaiResponse.body}`);
    }

    const stream = openaiResponse.body;

    await streamResponse(stream, res);

    await res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
}

async function streamResponse(stream: ReadableStream<Uint8Array> | null, response: NextApiResponse) {

  if(!stream) {
    response.status(500).json({ error: "Internal Error" });
    return;
  }

  let decoder = new TextDecoder();
  let encoder = new TextEncoder();
  const writable = new WritableStream({
    write(chunk) {
      chunk = decoder.decode(chunk)
      if(chunk.startsWith("data: ")) {
        chunk = chunk.replace("data: ", "").trim();
        chunk = chunk + ",";
      }
      console.log("chunk", chunk)
      chunk = encoder.encode(chunk);
      response.write(chunk);
    },
  });

  await stream.pipeTo(writable);
}