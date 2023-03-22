import { useConversation } from "@/components/utils/ConversationContext"
import { Message } from "@/models/Message"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"





export default function Chats({children}: {children: ReactNode}) {

    const router = useRouter()
    const { id } = router.query


    const { getConversation, activeConversationMessages, activeConversation } = useConversation() 

    return (
      <div className="flex h-full flex-col spacing-2" id="chat-container">
        {activeConversationMessages.map((message:Message, index:string) => {
            console.log('message', message)

            return (
                <div className="flex flex-col w-full p-2 bg-gray-200/50 h-fit mb-1" key={index}>
                    <span className="font-semibold">{message.senderId}</span>
                    <span className="whitespace-pre-wrap">{message.content}</span>
                </div>
            )
        })
        }
      </div>
    )
}