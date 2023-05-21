import Link from "next/link";
import {Conversation} from "@/models/Conversations";
import React, {useEffect, useRef, useState} from "react";
import SidebarItemActions from "@/components/sidebar/SidebarItemActions";

interface ConversationUIProps {
    conversation: Conversation,
    active?: boolean
}

export default function ConversationUI({conversation, active}: ConversationUIProps) {




    const [isRenaming, setIsRenaming] = useState(false)
    //const [isRemoving, setIsRemoving] = useState(false)
    const [cancel, setCancel] = useState(false)


    let longHoverClasses = "opacity-0 pointer-events-none"
    const [hoverClasses, setHoverClasses] = useState(longHoverClasses)
    const [confirmState, setConfirmState] = useState(false)
    const [title, setTitle] = useState(conversation.data.title)

    const input = useRef(null);

    const handleTitleChange = (e: any) => {
        setTitle(e)
    }

    const handleRename = () => {
        setIsRenaming(!isRenaming)
        setConfirmState(!confirmState)
    }

    useEffect(() => {
        if(input.current){
            // @ts-ignore
            input.current.focus()
        }
    }, [isRenaming]);

    const handleRemove = () => {

    }

    const sendRename = (isConfirmed:boolean) => {
        setIsRenaming(!isRenaming)
        setConfirmState(!confirmState)


        if(isConfirmed){
            conversation.data.title = title
        }
    }

    const sendRemove = () => {

    }


    const handleMouseEnter = () => {
        if (!confirmState) {
            setHoverClasses("")
        }
    }

    const handleMouseLeave = () => {
        if(!confirmState){
            setHoverClasses(longHoverClasses)
        }
    }

    const handleOutSideClick = () => {
       setCancel(true);
       setCancel(false)
    }


    let activeConv = active ? "bg-blue-400 text-white" : "group-hover:bg-gray-200";

    return (

            <div className="relative flex flex-col overflow-hidden items-center h-12 w-full"
                 onMouseEnter={handleMouseEnter}
                 onMouseLeave={handleMouseLeave}>

                {isRenaming ? (
                    <input ref={input} type={"text"} name={'title'} value={title} onChange={handleTitleChange} className={`w-full bg-transparent h-full px-4 py-2 outline-none`}/>
                ) : (
                    <Link href={`/${conversation.id}`} className={"w-full h-full flex items-center overflow-hidden group"}>

                        <div className={`w-full pl-4 pr-14 py-2 flex items-center rounded-md 
                          ${activeConv}`
                        }>
                            <div className={`whitespace-nowrap text-clip overflow-hidden flex-1 relative`}>
                                {conversation.data.title}
                                <div
                                    className={`absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l  ${active ? 'from-blue-400' : 'from-white group-hover:from-gray-200'} `}></div>
                            </div>
                        </div>

                    </Link>
                )}

                <div className={`absolute bg-transparent h-full items-center top-0 right-0 flex  ${hoverClasses}`}>
                    <SidebarItemActions rename={
                        {
                            action:handleRename,
                            confirmation: {
                                state: true,
                                action: sendRename
                            }
                        }
                    } remove={
                        {
                            action:handleRemove,
                            confirmation: {
                                state: true,
                                action: handleRemove,
                            }
                        }
                    } cancel={cancel} />
                </div>

            </div>


    )

}