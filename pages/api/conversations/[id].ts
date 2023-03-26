import { Message } from "@/models/Message";
import { db } from "@/utils/firebase";
import { getCollection } from "@/utils/firestore";
import { isUserConnected } from "@/utils/TokenHandler";
import {
    addDoc,
    arrayUnion,
    doc,
    DocumentData,
    getDoc,
    getDocs,
    orderBy,
    query,
    setDoc,
    updateDoc,
    where
} from "firebase/firestore";
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

    const chatRef = getCollection("messages")
    const q = query(chatRef, where("conversationID", "==", id), orderBy("createdAt", "asc"));
    const results = await getDocs(q);


    const messages:Array<Message> = [];

    results.forEach((doc) => {
        let {content, role, createdAt, state} = doc.data();
        messages.push({id: doc.id, content, role, createdAt, state})
    });

      console.log('Chat', messages);

    res.status(200).json({ message: messages});
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

    let msg:Message = {
        content: message,
        createdAt: new Date(),
        role: isReply ? "assistant" : "user",
        conversationID: id.toString(),
    }

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
            msg.conversationID = conversationID;
        }catch (e) {
            console.error("Error updating document: ", e);
            res.status(500).json({ error: "Error updating document", message: msg })
        }
    }

    try {
        const messagesRef = getCollection("messages");
        const m = await addDoc(messagesRef, msg);

        msg.id = m.id;
    } catch (e) {
        console.error("Error updating document: ", e);
        res.status(500).json({ error: "Error updating document", message: msg })
    }

    res.status(201).json({ message: msg })

}
