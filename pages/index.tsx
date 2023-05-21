import {useConversation} from "@/contexts/ConversationContext";
import {Message} from "@/models/Message";
import MessageUI from "@/components/message/MessageUI";

export default function Home() {

    const { activeConversationMessages  } = useConversation()

    return (
        <>
            {activeConversationMessages.length == 0 && <div className="text-center">No messages yet</div>}
            {activeConversationMessages.map((message:Message, index:string) => {
                return (
                    <MessageUI message={message} key={index}/>
                )
            })}
        </>
    )
}