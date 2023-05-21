import {NextApiRequest, NextApiResponse} from "next";
import {adminAuth} from "@/utils/fireadmin";
import {getCollection, } from "@/utils/firestore";
import {getDocs, query, where} from "firebase/firestore";
import {Conversation} from "@/models/Conversations";

import algoliasearch from 'algoliasearch/lite';


interface MessageResult {
    id: string,
    conversationID: string,
    text: string,
    date?: string,
}

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // Method post not allowed
        res.status(405).json({error: 'Method not allowed'})
    }

    if (req.method === 'GET') {
        await GET(req, res)
    }


}


const GET = async (req: NextApiRequest, res: NextApiResponse) => {


    let token = req.cookies.token;

    if(!token) {
        res.status(401).json({ error: "Unauthorized" });
        res.end();
        return;
    }

    const verif = await adminAuth.verifyIdToken(token);
    if(!verif) {
        res.status(401).json({ error: "Unauthorized" });
        res.end();
        return;
    }


    const {q, from, to, mode} = req.query;




    if(!q || q == null) {
        res.status(200).json({ conversations: [], messages: [] });
        res.end();
        return;
    }

    //Search this query in firestore in collections (messages, conversations) where userID = current user
    let userID = verif.uid;
    const conversationsRef = getCollection("conversations");

    const conversationQuery = query(conversationsRef, where("userID", "==", userID),);
    const convResults = await getDocs(conversationQuery);

    let ids:string[] = []
    convResults.forEach(
        (doc) => {
            ids.push(`conversationID:${doc.id}`)
        }
    )




    let conversations: Conversation[] = []
    let messages:MessageResult[] = []

    const searchClient = algoliasearch('FAYHH1CVSJ', '5d7c6fabbbb314ca0d6a6c9a7f3786af');





    try {

        //Mode 0: Search in conversations
        //Mode 1: Search in messages
        //Mode null or else: Search in both


        if(mode == '0' || mode == null) {
            const indexConv = searchClient.initIndex('ConversationTitle');
            const resultConversation = await indexConv.search(q.toString(), {
                filters: `userID:${userID}`,
                snippetEllipsisText: '…',

                highlightPreTag: undefined,
                highlightPostTag: undefined,
                attributesToHighlight: [],
                attributesToSnippet: [
                    'title:10'
                ]
            });

            const hitsConversation = resultConversation.hits;
            hitsConversation.forEach((hit) => {
                conversations.push({
                    id: hit.objectID,
                    // @ts-ignore
                    title: hit?.title
                })
            });
        }

        if(mode == '1' || mode == null) {
            const indexMessage = searchClient.initIndex('MessageContent');

            let filters = `${ids.join(" OR ")}`.trim()

            const resultMessage = await indexMessage.search(q.toString(), {
                filters: `${filters}`,
                highlightPreTag: '<strong>',
                highlightPostTag: '</strong>',
                snippetEllipsisText: '…',
                attributesToSnippet: [
                    'content:10'
                ]
            });

            const hitsMessage = resultMessage.hits;
            hitsMessage.forEach((hit) => {

                //TODO Map hit to a type
                messages.push({
                    id: hit.objectID,
                    // @ts-ignore
                    conversationID: hit?.conversationID,
                    // @ts-ignore
                    text: hit?._snippetResult?.content?.value,
                    // @ts-ignore
                    date: hit?.createdAt
                })
            });
        }

    } catch (error) {
        res.status(500).json({
            conversations: [],
            message: [],
            // @ts-ignore
            error: error.message
        });
    }




    // @ts-ignore
    res.status(200).json({conversations, messages});
    res.end();
    return
}

