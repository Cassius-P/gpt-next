import type { NextApiRequest, NextApiResponse } from "next";
import {Message} from "@/models/Message";
import { createParser } from 'eventsource-parser'




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

    if(m.role == "error"){
        m.role = "user";
    }
      return m;
  })



  const openaiUrl = "https://api.openai.com/v1/chat/completions";
  const API_KEY = process.env.OPENAI_MAIN_API_KEY;
  if (!API_KEY) {
    res.status(500).json({ error: "Internal Error" });
    return;
  }

  const parameters = {
    model: 'gpt-3.5-turbo',
    stream: true,
    messages,
    n : 1,
  };


  let message = '';
  const onMessage =  (data:string) => {

    if (data === '[DONE]') {
      res.write(data);
      res.end();


      return
    }

    try {
      const response = JSON.parse(data)
      console.log("OpenAI stream response", JSON.stringify(response))
      if(response.usage){
        //console.log("OpenAI stream usage", response.usage)
      }

      if (response?.choices?.length && response.choices[0].delta.content){
        message += response.choices[0].delta.content;
        res.write(response.choices[0].delta.content)
      }

    } catch (err) {
      console.warn('OpenAI stream SEE event unexpected error', err)
      res.status(500).send({ message: "Internal Server Error" });
    }
  }

  let openaiSSEConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(parameters),
    onMessage,
  };

  try {
    fetchSSE(
        openaiUrl,
        openaiSSEConfig
    ).catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error" });
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }


}

async function fetchSSE(
    url: string,
    options: Parameters<typeof fetch>[1] & { onMessage: (data: string) => void }) {
  const { onMessage, ...fetchOptions } = options
  const res = await fetch(url, fetchOptions)
  if (!res.ok) {
    let reason: string

    try {
      reason = await res.text()
    } catch (err) {
      reason = res.statusText
    }

    const msg = `ChatGPT error ${res.status}: ${reason}`


    throw msg
  }

  const parser = createParser((event) => {
    if (event.type === 'event') {
      onMessage(event.data)
    }
  })

  if (!res.body?.getReader) {
    const body: NodeJS.ReadableStream = res.body as any

    if (!body.on || !body.read) {
      throw new Error('Unexpected response body')
    }

    body.on('readable', () => {
      let chunk: string | Buffer
      while (null !== (chunk = body.read())) {
        parser.feed(chunk.toString())
      }
    })
  } else {
    for await (const chunk of streamAsyncIterable(res.body)) {
      const str = new TextDecoder().decode(chunk)
      parser.feed(str)
    }
  }
}

async function* streamAsyncIterable<T>(stream: ReadableStream<T>) {
  const reader = stream.getReader()
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        return
      }
      yield value
    }
  } finally {
    reader.releaseLock()
  }
}