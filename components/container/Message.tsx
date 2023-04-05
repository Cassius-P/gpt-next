import {Message} from "@/models/Message";
import Highlighter from "@/components/container/Highlighter";

export default function MessageUI({message, index}: { message: Message, index?: string | number }) {


    let classes = 'bg-gray-200/50';
    if(message?.role == 'error'){
        classes = 'text-red-500 border border-red-500 bg-red-500/10'
    }
    if(message?.role == 'assistant'){
        classes ="bg-gray-300/50"
    }

    return (
        <>
            {


                (message != null )? (
                    <div className={`flex flex-col w-full p-4  h-fit mb-1 prose ${classes}`} key={message.id} id={message.id}>
                        <span className="font-semibold">{message.role} - #<span className="font-semibold text-xs">{message.id}</span> - <span className="text-xs">{message.createdAt}</span> </span>
                        {message.role == 'user' && (<div className={'whitespace-break-spaces'}>
                            {message.content}
                        </div>)}
                        {message.role != 'user' && <Highlighter text={message.content} isLoading={message.state == "loading"}/>}
                    </div>
                ) : (
                    <div > error</div>
                )
            }
        </>
    )
}