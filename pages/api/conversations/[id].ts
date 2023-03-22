import { Message } from "@/models/Message";
import { db } from "@/utils/firebase";
import { getCollection } from "@/utils/firestore";
import { isUserConnected } from "@/utils/TokenHandler";
import { addDoc, arrayUnion, doc, DocumentData, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai-streams/node";


export default function handler (req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "GET") {
        GET(req, res);
    } else if(req.method === "POST") {
        POST(req, res);
    }
}


export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const verif = await isUserConnected(req, res);
    if(!verif) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    const userID = verif.uid;
    const { id } = req.query;

    if(!id) {
        res.status(400).json({ error: "No ID" });
        return;
    }

    const chatRef = doc(db, "messages", id.toString());
    const result = await getDoc(chatRef);

    if(!result.exists()) {
        res.status(400).json({ error: "No messages" });
        return;
    }

    let docs = {
        id: result.id,
        data: result.data()
    }
    
      console.log('Chat', docs);

    res.status(200).json({ message: docs});
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    const verif = await isUserConnected(req, res);
    if(!verif) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    const userID = verif.uid;
    const { id } = req.query;

    let createConversation = false
    if(!id) {
        res.status(400).json({ error: "No ID" });
        return;
    }

    if(id == '0'){
        createConversation = true
    }

    const { message, isReply } = req.body;
    if(!message) {
        res.status(400).json({ error: "No text" });
        return;
    }

    let msg = {
        content: message,
        createdAt: new Date(),
        senderId: isReply ? "ia" : "user",
    }


    let msgSaved = false;
    if(createConversation){
        try {
            const conversationsRef = getCollection("conversations");
            const conv = {
                title: msg.content,
                userID: userID,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
            const c = await addDoc(conversationsRef, conv);
            let conversationID = c.id;


            const messagesRef = doc(db, "messages", conversationID)
            const m = await setDoc(messagesRef, {
                messages:[msg]
            });

            msgSaved = true;
        }catch (e) {
            console.error("Error updating document: ", e);
            res.status(500).json({ error: "Error updating document", message: msg })
        }



    }

    if(!createConversation){
        try {
            const messagesRef = doc(db, "messages", id.toString())
            const m = await updateDoc(messagesRef, {
                messages: arrayUnion(msg)
            });
            msgSaved = true;
        } catch (e) {
            console.error("Error updating document: ", e);
            res.status(500).json({ error: "Error updating document", message: msg })
        }
    }



    if(msgSaved){
        const stream = await OpenAI(
            "chat",
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        content: msg.content,
                        role: "user",
                    },
                ],
            },
            { apiKey: process.env.OPENAI_API_KEY    }
        );

        stream.pipe(res);
    }else{
        res.status(500).json({ error: "Error updating document", message: msg })
    }

}
