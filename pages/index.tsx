import Container from "@/components/container/Container";
import Sidebar from "@/components/sidebar/Sidebar";
import {useConversation} from "@/components/utils/ConversationContext";
import {Message} from "@/models/Message";
import Highlighter from "@/components/container/Highlighter";
import MessageUI from "@/components/container/Message";

export default function Home() {

    const { activeConversationMessages  } = useConversation()

    return (
        <div className="flex h-full flex-col spacing-2" id="chat-container">
            {activeConversationMessages.map((message:Message, index:string) => {
                return (
                    <MessageUI message={message} key={index}/>
                )
            })
            }
        </div>
    )

}