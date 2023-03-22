import { Conversation } from "@/models/Conversations"
import Link from "next/link"
import { useConversation } from "../utils/ConversationContext"


export default function Sidebar() {

    const { conversations } = useConversation()

    return (
        <aside className="w-2/12 bg-gray-200 px-1 h-full">
            <h2 className="font-bold text-lg mb-4">Sidebar</h2>
            <div className="mb-2 flex flex-col" >
                <Link href={`/`} className="p-4 flex flex-col rounded-md  hover:bg-gray-600 bg-gray-400 text-white font-semibold">
                    New chat
                </Link>

            </div>
            {conversations.map((conversation:Conversation) => {
                return (
                    <div className="mb-2 flex flex-col
                    " key={conversation.id}>
                        <Link href={`/${conversation.id}`} className="px-4 py-2 flex flex-col rounded-md  hover:bg-gray-300">
                            {conversation.data.title}
                            <span className="text-sm font-italic">#{conversation.id}</span>
                        </Link>

                    </div>
                )
            })}
        </aside>
    )




}

