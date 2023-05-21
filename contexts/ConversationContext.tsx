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
    const [activeConversationError, setActiveConversationError] = useState<boolean>(false)

    const [responseStopped, setResponseStopped] = useState<boolean>(false)
    const [responseLoading, setResponseLoading] = useState<boolean>(false)

    const router = useRouter();

    useEffect(() => {
        let id = router.query.id;

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
    useEffect(() => {
        if(activeConversationMessages.length == 0) return;

        const lastMessage = activeConversationMessages[activeConversationMessages.length - 1]
        if(lastMessage.role == 'error') setActiveConversationError(true);
    }, [activeConversationMessages])
    const getConversations = async () => {
        let res: Response = await fetch('/api/conversations')
        let data = await res.json()
        let message:Array<Conversation> = data.message;

        setConversations(message)
        return message;
    }
    const getConversation = async (conversationID: string) => {
        if(activeConversation == '0' && conversationID == null || conversationID == undefined) return []
        if(activeConversation == '0' && conversationID == '0') {
            return activeConversationMessages
        }

        let res: Response = await fetch(`/api/conversations/${conversationID}`)
        let data = await res.json()
        let message:Array<Message> = data.message

        
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
        const savedMessage:Message = await sendMessage(message)

        if(savedMessage == null) {
            message.state = 'failed'
            updateLastMessage(message);
            return;
        }

        if(activeConversation == '0' && savedMessage.conversationID != null) {
            const convID = savedMessage.conversationID;
            setActiveConversation(convID)
        }


        updateLastMessage(savedMessage)


        askResponse({message}).then((response:Message | null) => {
            if(response == null) return;

            response.conversationID = savedMessage.conversationID;

            sendMessage(response).then((message:Message) => {

            });
        });
    }
    const addMessage = (message: Message) => {
        let array = activeConversationMessages;
        array.push(message)
        setActiveConversationMessages(array)
    }
    const sendMessage = async (message: Message) => {
        let isReply = false;
        if(message.role == 'assistant') {
            isReply = true;
        }


        let convID = activeConversation;

        if(convID == '0' && message.conversationID != null && message.conversationID != '0' && isReply) {
            convID = message.conversationID;
        }

        if(convID == '0' && isReply) {
            return null;
        }

        if(message.content == null || message.content == '') return null;

        const newMessage = await fetch(`/api/conversations/${convID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message, isReply })
        })

        if(newMessage.status != 201) {
            return null;
        }

        const res = await newMessage.json()



        if(res.conversation != null) {
            addConversation(res.conversation)
        }

        return res.message;
    }
    const updateMessage = async (message: Message) => {
        console.log("Updating message", message)
        const res = await fetch(`/api/conversations/${message.conversationID}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        })

        if(!res.ok){
            console.log("Update failed")
            message.state = 'failed'
            return message
        }

        let m = await res.json()
        console.log("Updated to", m)
        return m.message;

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
    const addConversation = (conversation: Conversation) => {
        let array = conversations;
        array.push(conversation)
        setConversations(array)
    }
    const askResponse = async ({message, messageToRegen=null}: {message: Message, messageToRegen?:Message|null}) => {

        let reply:Message = {
            content: '',
            createdAt: new Date(),
            role: 'assistant',
            state: 'loading',
            id: 'tmp'
        }

        let content = '';
        let isAdded = false;


        setResponseLoading(true);

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


            try {
                while (!responseStopped) {
                    const {done, value} = await reader.read();
                    if (done) {
                        break;
                    }
                    if (value) {

                        let str = decoder.decode(value, {stream: true});
                        if(str === "[[DONE]]" || str === "[DONE]") {
                            setResponseLoading(false);
                            break;
                        };

                        reply.content += str;

                        if(!isAdded) {
                            addMessage(reply);
                            isAdded = true;
                        }else{
                            updateLastMessage(reply);
                        }
                    }
                }
            } catch(e){
                throw e;
            } finally {
                reader.releaseLock();
            }


        }).catch(error => {
            reply.role = 'error';
            reply.content = error.message;
            setActiveConversationError(true)
        }).finally(() => {

            delete reply.state;
            delete reply.id;


            message.state = "sent"
            if(messageToRegen) {
                messageToRegen.role = reply.role;
                messageToRegen.content = reply.content;

                updateMessage(messageToRegen).then((message:Message) => {
                    isAdded ? updateLastMessage(message) : addMessage(message)
                })
            }else{
                sendMessage(reply).then((message:Message) => {
                    isAdded ? updateLastMessage(message) : addMessage(message)
                })
            }


            setResponseLoading(false)
            setResponseStopped(false)
        });

        return reply;
    }
    const regenerateResponse = async () => {

        if(activeConversationMessages.length < 2) {
            console.log ("No messages to regenerate");
        };
        const beforeLastMessage = activeConversationMessages[activeConversationMessages.length - 2];

        if(beforeLastMessage == null) return;
        if(beforeLastMessage.role == 'assistant') return;

        setActiveConversationError(false)

        let array = activeConversationMessages;
        let lastMessage = array.pop();
        setActiveConversationMessages([...array]);


        askResponse({message: beforeLastMessage, messageToRegen: lastMessage});




    }
    const newChat = async () => {
        await router.push('/');
        setActiveConversation('0');
        setActiveConversationMessages([]);
    }


    return <ConversationContext.Provider value={{
        conversations,
        getConversations,
        getConversation,
        submitMessage,
        activeConversation,
        activeConversationMessages,
        activeConversationError,
        setActiveConversationMessages,
        setActiveConversation,
        setActiveConversationError,
        responseStopped, setResponseStopped, responseLoading,
        regenerateResponse,
        newChat
        }}>{children}</ConversationContext.Provider>
}

export const useConversation = () =>  useContext(ConversationContext)