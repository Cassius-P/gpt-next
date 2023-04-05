import { useConversation } from "@/components/utils/ConversationContext"
import { Message } from "@/models/Message"
import {ReactNode, useEffect, useRef, useState} from "react"
import Highlighter from "@/components/container/Highlighter";
import MessageUI from "@/components/container/Message";
import {GetServerSidePropsContext} from "next";
import { parse } from 'url'
import {useRouter} from "next/router";



export default function Chats({children}: {children: ReactNode, trigger:boolean;}) {

    const { activeConversationMessages, setActiveConversationError, responseLoading, activeConversation  } = useConversation()

    const [trigger, setTrigger] = useState(false)



    const router = useRouter();
    //if url contains # then setTrigger(true)
    if(router.asPath.includes("#") && !trigger){
        setTrigger(true)
    }





    useEffect(() => {

        if (!trigger) return;
        if (!activeConversationMessages || activeConversationMessages.length == 0) return;
        const scrollToHashElement = () => {
            const { hash } = window.location;
            const elementToScroll = document.getElementById(hash?.replace("#", ""));

            console.log('Need to scroll to ',  hash, elementToScroll?.offsetTop)

            if (!elementToScroll) return;

            elementToScroll.scrollIntoView()
        };


        scrollToHashElement();
        window.addEventListener("hashchange", scrollToHashElement);
        return window.removeEventListener("hashchange", scrollToHashElement);

    }, [activeConversationMessages]);



    /*const scrolDown = () => {
        const container = containerRef.current;
        if (container) {
            console.log('container.scrollHeight', container.scrollHeight)
            console.log('container.clientHeight', container.clientHeight)
            console.log('container.scrollTop', container.scrollTop)
            container.scrollTop = container.scrollHeight;
        }
    }

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            console.log('container.scrollHeight', container.scrollHeight)
            console.log('container.clientHeight', container.clientHeight)
            console.log('container.scrollTop', container.scrollTop)

            const isAtBottom = container.scrollHeight - container.clientHeight <= (container.scrollTop - 260);
            console.log('isAtBottom', isAtBottom, "\nisLoading", responseLoading)
            if (isAtBottom && responseLoading) {
                scrolDown()
            }
        }
    }, [responseLoading]);

    useEffect(() => {
        scrolDown()
    }, [containerRef, activeConversation]);*/




    return (
      <div className="flex flex-col spacing-2 overflow-auto" id="chat-container" >
        {activeConversationMessages.map((message:Message, index:string) => {
            return (
                <MessageUI message={message} key={index}/>
            )
        })
        }
      </div>
    )
}
