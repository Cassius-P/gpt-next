import { Message } from "@/models/Message";
import { db } from "@/utils/firebase";
import {getCollection, tokenize} from "@/utils/firestore";
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
    } else if (req.method === "PUT") {
        PUT(req, res);
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

        createdAt = createdAt.toDate().toLocaleString();
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
        content: message.content,
        createdAt: new Date(),
        role: message.role,
        conversationID: id.toString(),
    }

    console.log("Chat message received", msg)


    let response = {}

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
            //@ts-ignore
            response["conversation"] = {id: conversationID, data:conv}
        }catch (e) {
            console.error("Error creating document: ", e);
            res.status(500).json({
                error: {
                    message: "Error creating document",
                    e
                },
                message: msg
            })
        }
    }

    try {
        const messagesRef = getCollection("messages");
        const m = await addDoc(messagesRef, msg);

        msg.id = m.id;

        //@ts-ignore
        response["message"] = msg;
    } catch (e) {
        console.error("Error updating document: ", e);
        res.status(500).json({
            error: {
                message: "Error updating document",
                e
            },
            message: msg
        })
    }

    res.status(201).json(response)

}


export async function PUT(req: NextApiRequest, res: NextApiResponse) {
    const verif = await isUserConnected(req, res);
    if(!verif) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    const { id } = req.query;

    if(!id) {
        res.status(400).json({ error: "No ID" });
        return;
    }

    if(id == '0'){
        return await POST(req, res);
    }

    const { message } = req.body;
    if(!message) {
        res.status(400).json({ error: "No message" });
        return;
    }

    const messagesRef = getCollection("messages");
    const m = await updateDoc(doc(messagesRef, message.id), message);

    res.status(200).json({message})
}