import { Conversation } from "@/models/Conversations"
import Link from "next/link"
import { useConversation } from "../utils/ConversationContext"
import ConversationUI from "@/components/sidebar/Conversation";
import {useAuth} from "@/components/auth/AuthContext";


export default function Sidebar() {

    const { conversations, activeConversation, newChat } = useConversation()
    const {signout} = useAuth();
    const handleSignout = () => {
        signout()
    }

    //const test = [  {    "id": "1",    "data": {      "title": "Object 1"    }  },  {    "id": "2",    "data": {      "title": "Object 2"    }  },  {    "id": "3",    "data": {      "title": "Object 3"    }  },  {    "id": "4",    "data": {      "title": "Object 4"    }  },  {    "id": "5",    "data": {      "title": "Object 5"    }  },  {    "id": "6",    "data": {      "title": "Object 6"    }  },  {    "id": "7",    "data": {      "title": "Object 7"    }  },  {    "id": "8",    "data": {      "title": "Object 8"    }  },  {    "id": "9",    "data": {      "title": "Object 9"    }  },  {    "id": "10",    "data": {      "title": "Object 10"    }  },  {    "id": "11",    "data": {      "title": "Object 11"    }  },  {    "id": "12",    "data": {      "title": "Object 12"    }  },  {    "id": "13",    "data": {      "title": "Object 13"    }  },  {    "id": "14",    "data": {      "title": "Object 14"    }  },  {    "id": "15",    "data": {      "title": "Object 15"    }  },  {    "id": "16",    "data": {      "title": "Object 16"    }  },  {    "id": "17",    "data": {      "title": "Object 17"    }  },  {    "id": "18",    "data": {      "title": "Object 18"    }  },  {    "id": "19",    "data": {      "title": "Object 19"    }  },  {    "id": "20",    "data": {      "title": "Object 20"    }  },  {    "id": "21",    "data": {      "title": "Object 21"    }  },  {    "id": "22",    "data": {      "title": "Object 22"    }  },  {    "id": "23",    "data": {      "title": "Object 23"    }  },  {    "id": "24",    "data": {      "title": "Object 24"    }  },  {    "id": "25",    "data": {      "title": "Object 25"    }  }]

    const handleNewChat = () => {
        newChat()
    }

    return (
        <aside className="w-2/12 bg-gray-200 px-1 h-full flex-col flex justify-between py-1">
            <div className="mb-2 flex flex-col" >
                <button onClick={handleNewChat} className="p-4 flex flex-col rounded-md  hover:bg-gray-600 bg-gray-400 text-white font-semibold">
                    New chat
                </button>

            </div>

            <div className="grid grow auto-rows-min gap-1 overflow-y-auto">
                {conversations && conversations.map((conversation:Conversation) => {
                    return (
                        <ConversationUI
                            conversation={conversation}
                            active={(activeConversation == conversation.id)}
                            key={conversation.id}
                        />
                    )
                })}
            </div>


            <div className="pt-4 flex flex-col relative justify-between border-t border-t-gray-400 ">

                <button
                    className="p-4 flex rounded-md hover:bg-gray-600 bg-gray-400 text-white font-semibold items-center"
                    onClick={handleSignout}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    <span className="text-sm">Sign out</span>
                </button>
            </div>
        </aside>
    )




}

