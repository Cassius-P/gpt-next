import { createContext, ReactNode, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { Conversation } from "@/models/Conversations";
import { Message } from "@/models/Message";
import {TextDecoderStream} from "stream/web";






export const ConversationContext = createContext<any>({});
ConversationContext.displayName = "ConversationContext";

export const ConversationProvider = ({ children } : {children:ReactNode}) => {

    const [conversations, setConversations] = useState<Array<Conversation>>([])
    const [activeConversation, setActiveConversation] = useState('0')
    const [activeConversationMessages, setActiveConversationMessages] = useState<Array<Message>>([])

    const router = useRouter();


    useEffect(() => {
        let id = router.query.id;
        console.log('ID r', id);

        if (id == null || id == undefined) {
            id = '0'
        };

        //if id is a string[] then id[0] is the id
        if (id instanceof Array) {
            id = id[0];
        }

        setActiveConversation(id)
        getConversation(id);
    }, [router.query.id])

    useEffect(() => {
        getConversations().then((conversations) => {
            setConversations(conversations)
            });
    }, [])

    const getConversations = async () => {
        let res: Response = await fetch('/api/conversations')
        let data = await res.json()
        let message:Array<Conversation> = data.message;
        console.log('Conversations', message)


        return message;
    }


    
    const getConversation = async (conversationID: string) => {
        if(conversationID == null || conversationID == undefined) return []
        if(conversationID == '0') {
            console.log("fetch id 0 ")
            return activeConversationMessages
        }

        let res: Response = await fetch(`/api/conversations/${conversationID}`)
        let data = await res.json()
        console.log('DATA', data)
        let message:Array<Message> = data.message.data.messages;
        console.log('Conversation messages', message)

        
        setActiveConversationMessages(message)

        return message;
    }

    const submitMessage = async (text: string) => {
        console.log("text", text);
        
        let url = `/api/conversations/${activeConversation}`
        console.log(`Post to ${url}`, { message: text })
        
        let res:Response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: text })
        })

       /* let rep = await res.json()
        console.log('message', rep)

        let msg = rep.message
        const state = rep.status == 200 ? 'sent' : 'failed'

        if(msg.conversation){
            let conv:Conversation = msg.conversation
            setConversations([...conversations, conv])
            router.push(`/${msg.conversation.id}`)
        }

        msg.status = state;*/
        if (res.body ==null) {
            console.log('res.body is null')
        }
        const reader: ReadableStreamDefaultReader<Uint8Array> = res.body!.getReader();
        const decoder: TextDecoder = new TextDecoder();
        let val: string = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            let str = decoder.decode(value);

            if (val == '') {
                str = "[" + str.replaceAll("}{", "},{") + "]";
                str = JSON.parse(str);
                str = str[1]['content'] + str[2]['content']
            }else {
                str = JSON.parse(str);
                str = str?.content
            }

            val += str;
        }

        console.log('val', val)


        //setActiveConversationMessages([...activeConversationMessages, msg])

        return val;
    }

    return <ConversationContext.Provider value={{
        conversations,
        getConversations,
        getConversation,
        submitMessage,
        activeConversation,
        activeConversationMessages,
        setActiveConversationMessages,
        setActiveConversation }}>{children}</ConversationContext.Provider>
}

export const useConversation = () =>  useContext(ConversationContext)