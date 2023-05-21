import {Message} from "@/models/Message";
import Highlighter from "@/components/message/Highlighter";

export default function MessageUI({message, index}: { message: Message, index?: string | number }) {


    let classes = 'question bg-blue-400 text-white';
    if(message?.role == 'error'){
        classes = 'response text-red-500 border border-red-500 bg-red-500/10'
    }
    if(message?.role == 'assistant'){
        classes ="response bg-white"
    }



    return (
        <>
            {


                (message != null )? (
                    <div className={`relative group flex justify-end p-4 pt-0 ${message.role != 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={'transition delay-100 ease-in-out h-full flex flex-col justify-end opacity-0 group-hover:opacity-100'}>
                            <span className="font-semibold text-gray-400">{/*{message.role} - #<span className="font-semibold text-xs">{message.id}</span> - */}<span className="text-xs">{message.createdAt.toString()}</span> </span>
                        </div>
                        <div className={`message flex flex-col w-5/6 md:w-3/5 p-4 h-fit prose rounded-md ${classes}`} key={message.id} id={message.id}>

                            {message.role == 'user' && <div className={'whitespace-break-spaces'}> {message.content} </div> }
                            {message.role != 'user' && <Highlighter text={message.content} isLoading={message.state == "loading"}/>}

                        </div>

                    </div>

                ) : (
                    <div>error</div>
                )
            }
        </>
    )
}