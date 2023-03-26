import { useConversation } from "@/components/utils/ConversationContext"
import { Message } from "@/models/Message"
import { ReactNode, useEffect, useState } from "react"
import Highlighter from "@/components/container/Highlighter";




export default function Chats({children}: {children: ReactNode}) {

    const { activeConversationMessages  } = useConversation()

    return (
      <div className="flex h-full flex-col spacing-2" id="chat-container">
        {activeConversationMessages.map((message:Message, index:string) => {
            return (
                <div className="flex flex-col w-full p-2 bg-gray-200/50 h-fit mb-1 prose" key={message.id}>

                    <span className="font-semibold">{message.role} - #<span className="font-semibold text-xs">{message.id}</span></span>
                    <Highlighter text={message.content} />
                </div>
            )
        })
        }
      </div>
    )
}