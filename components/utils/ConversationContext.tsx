import { createContext, ReactNode, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { Conversation } from "@/models/Conversations";
import { Message } from "@/models/Message";
import {createParser, ParsedEvent, ReconnectInterval} from 'eventsource-parser'


export const ConversationContext = createContext<any>({});
ConversationContext.displayName = "ConversationContext";

export const ConversationProvider = ({ children } : {children:ReactNode}) => {

    const [conversations, setConversations] = useState<Array<Conversation>>([])
    const [activeConversation, setActiveConversation] = useState('0')
    const [activeConversationMessages, setActiveConversationMessages] = useState<Array<Message>>([])

    const [responseStopped, setResponseStopped] = useState<boolean>(false)
    const [responseLoading, setResponseLoading] = useState<boolean>(false)

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

        setConversations(message)
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
        let message:Array<Message> = data.message
        console.log('Conversation messages', message)

        
        setActiveConversationMessages(message)

        return message;
    }

    const submitMessage = async (text: string) => {
        let message:Message = {
            id: 'tmp',
            content: text,
            createdAt: new Date(),
            role: 'user',
        }
        addMessage(message);
        const savedMessage = await sendMessage(message)

        if(savedMessage == null) {
            message.state = 'failed'
            updateLastMessage(message);
            return;
        }

        updateLastMessage(savedMessage)


        askResponse(savedMessage).then((response:Message | null) => {
            if(response == null) return;
            sendMessage(response).then((message:Message) => {
                //updateLastMessage(message);
            });
        });
    }

    const addMessage = (message: Message) => {
        let array = activeConversationMessages;
        array.push(message)
        setActiveConversationMessages(array)
    }

    const sendMessage = async (message: Message) => {
        //Send message to API
        //then Update message state
        let isReply = false;
        if(message.role == 'assistant') {
            isReply = true;
        }

        const newMessage = await fetch(`/api/conversations/${activeConversation}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message.content, isReply })
        })

        if(newMessage.status != 201) {
            console.log('Error', newMessage)
            return null;
        }

        const res = await newMessage.json()
        console.log("Sent message", res.message)
        return res.message;
    }

    const updateMessage = (message: Message) => {
        let newMessages = activeConversationMessages.map((msg) => {
            if(msg.id == message.id) {
                return message
            }
            return msg
        })
        setActiveConversationMessages(newMessages)
    }

    const updateLastMessage = (message: Message) => {
        updateMessageWithIndex(message, activeConversationMessages.length - 1)
    }

    const updateMessageWithIndex = (message: Message, index: number) => {
        let array = activeConversationMessages;
        array[index] = message;

        let newMessages = [...array]
        setActiveConversationMessages(newMessages)
    }

    const askResponse = async (message: Message) => {

        let reply:Message = {
            content: '',
            createdAt: new Date(),
            role: 'assistant',
            state: 'loading',
            id: 'tmp'
        }

        let content = '';
        fetch(`/api/chat/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages:activeConversationMessages })
        }).then( async (response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            if (response.body == null) {
                return;
            }

            const decoder = new TextDecoder();
            const reader = response.body.getReader();

            let isAdded = false;

            try {
                while (!responseStopped) {
                    const {done, value} = await reader.read();
                    if (done) {
                        break;
                    }
                    if (value) {
                        let str = "[" + decoder.decode(value, {stream: true}) + "]";

                        if(str.endsWith(",]")){
                            str = str.substring(0, str.length - 2) + "]";
                        }
                        let obj = JSON.parse(str);

                        for (let i = 0; i < obj.length; i++) {
                            if(obj[i] == "DONE"){
                                setResponseLoading(false);
                                break;
                            }

                            if(obj[i].choices != null && obj[i].choices.length > 0){
                                let text = obj[i].choices[0].delta.content ? obj[i].choices[0].delta.content : '';
                                content += text;
                            }
                        }


                        reply.content = content;

                        if(!isAdded) {
                            addMessage(reply);
                            isAdded = true;
                        }else{
                            updateLastMessage(reply);
                        }
                    }
                }
            } finally {
                reader.releaseLock();
            }


        }).catch(error => {
            console.error('Error:', error)
        }).finally(() => {

            delete reply.state;
            delete reply.id;

            sendMessage(reply).then((message:Message) => {
                updateLastMessage(message);
            })
            setResponseLoading(false)
            setResponseStopped(false)
        });

        return reply;
    }


    return <ConversationContext.Provider value={{
        conversations,
        getConversations,
        getConversation,
        submitMessage,
        activeConversation,
        activeConversationMessages,
        setActiveConversationMessages,
        setActiveConversation,
        responseStopped, setResponseStopped, responseLoading
        }}>{children}</ConversationContext.Provider>
}

export const useConversation = () =>  useContext(ConversationContext)