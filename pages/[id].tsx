import { useConversation } from "@/contexts/ConversationContext"
import { Message } from "@/models/Message"
import {ReactNode, useEffect, useState} from "react"
import MessageUI from "@/components/message/MessageUI";
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





    return (
      <>
        {activeConversationMessages.map((message:Message, index:string) => {
            return (
                <MessageUI message={message} key={index}/>
            )
        })
        }

      </>
    )
}
