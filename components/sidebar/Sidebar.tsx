import { Conversation } from "@/models/Conversations"
import { useConversation } from "../../contexts/ConversationContext"
import ConversationUI from "@/components/sidebar/Conversation";
import {useAuth} from "@/contexts/AuthContext";
import Button from "@/components/button/Button";
import {useUI} from "@/contexts/UIContext";


export default function Sidebar() {

    const { conversations, activeConversation, newChat } = useConversation()
    const {signout} = useAuth();
    const {openModal , setModalView} = useUI();
    const handleSignout = () => {
        signout()
    }

    //const test = [  {    "id": "1",    "data": {      "title": "Object 1"    }  },  {    "id": "2",    "data": {      "title": "Object 2"    }  },  {    "id": "3",    "data": {      "title": "Object 3"    }  },  {    "id": "4",    "data": {      "title": "Object 4"    }  },  {    "id": "5",    "data": {      "title": "Object 5"    }  },  {    "id": "6",    "data": {      "title": "Object 6"    }  },  {    "id": "7",    "data": {      "title": "Object 7"    }  },  {    "id": "8",    "data": {      "title": "Object 8"    }  },  {    "id": "9",    "data": {      "title": "Object 9"    }  },  {    "id": "10",    "data": {      "title": "Object 10"    }  },  {    "id": "11",    "data": {      "title": "Object 11"    }  },  {    "id": "12",    "data": {      "title": "Object 12"    }  },  {    "id": "13",    "data": {      "title": "Object 13"    }  },  {    "id": "14",    "data": {      "title": "Object 14"    }  },  {    "id": "15",    "data": {      "title": "Object 15"    }  },  {    "id": "16",    "data": {      "title": "Object 16"    }  },  {    "id": "17",    "data": {      "title": "Object 17"    }  },  {    "id": "18",    "data": {      "title": "Object 18"    }  },  {    "id": "19",    "data": {      "title": "Object 19"    }  },  {    "id": "20",    "data": {      "title": "Object 20"    }  },  {    "id": "21",    "data": {      "title": "Object 21"    }  },  {    "id": "22",    "data": {      "title": "Object 22"    }  },  {    "id": "23",    "data": {      "title": "Object 23"    }  },  {    "id": "24",    "data": {      "title": "Object 24"    }  },  {    "id": "25",    "data": {      "title": "Object 25"    }  }]

    const handleNewChat = () => {
        newChat()
    }

    const handleSearch = () => {
        openModal();
        setModalView("SEARCH_VIEW")
    }

    return (
        <aside className="w-2/12 py-3 pl-3 h-full grid grid-cols-4 gap-2" style={{gridTemplateRows: 'auto 1fr auto'}}>

            {/*Search button*/}
            <div className={'bg-white rounded-md shadow-md col-span-1 aspect-[1/1]'}>
                <Button type={'button'}
                        customClass={'h-full w-full'}
                        onClick={handleSearch}
                        color={'white'}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                }/>
            </div>

            {/*New Chat button*/}
            <div className={'bg-white rounded-md shadow-md col-span-3'}>
                <Button type={'button'}
                        text={'New Chat'}
                        customClass={'h-full w-full'}
                        onClick={handleNewChat}
                        color={'white'}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                        }/>
            </div>

            {/*Conversations*/}
            <div className={'self-stretch flex flex-col bg-white p-2 shadow-md rounded-md col-span-4'} >
                <div className="grid grow auto-rows-min overflow-y-auto">

                    {(!conversations || conversations.length == 0) &&
                        (
                            <div className={'text-gray-400  flex flex-col my-3'}>
                                <span className={'w-full flex justify-center font-semibold'}>¯\_(シ)_/¯</span>
                                <span className={'w-full flex justify-center'}>Looks like there's nothing here yet</span>
                            </div>
                        )
                    }
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
            </div>


            {/*Sign out*/}
            <div className="rounded-md shadow-md col-span-1 aspect-[1/1]">
                <Button type={'button'}
                        customClass={'h-full w-full'}
                        onClick={handleSignout}
                        color={'white'}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                            </svg>
                        }/>

            </div>

        </aside>
    )




}

