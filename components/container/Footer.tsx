import {TextareaHTMLAttributes , useState, useRef} from "react"
import TextArea from "../forms/Textarea";
import Button from "../button/Button";
import {useConversation} from "../../contexts/ConversationContext";




export default function Footer() {


    const {responseLoading, setResponseStopped, responseStopped} = useConversation()



    const [text, setText] = useState('')

    const {submitMessage, activeConversationError, regenerateResponse} = useConversation();
    const textarea = useRef<HTMLTextAreaElement>();

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value)
    }

    const handleStopResponse = () => {
        console.log('Stopping response')
        setResponseStopped(false)
        console.log('Stopping response')
    }

    const handleButtonClick = async () => {
        let t = text
        if (t === '') return;

        console.log('Message =', t);
        let me = await submitMessage(t);
        setText('');

    }

    let alreadyRegen = false;
    const handleRegenerateResponse = async () => {
        if(alreadyRegen) return;

        alreadyRegen = true;
        regenerateResponse().then(() => {
            alreadyRegen = false;
        });
    }

    const handleEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        console.log(e.key)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleButtonClick();
        }
    }

    return (
        <>

                <div className="relative flex flex-col items-center justify-center">
                    <div className={'absolute -top-4 h-4 w-full from-gray-100 bg-gradient-to-t '}>

                    </div>

                    <div className="relative z-10 w-3/5 px-4 py-4">
                        <div className=' relative rounded-lg shadow-md bg-white p-1'>
                            { (!responseLoading && !activeConversationError) &&
                                <>
                                    <TextArea
                                        className="block w-full px-2 py-1 resize-none border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your text here"
                                        onChange={handleChange}
                                        value={text}
                                        rows={2}
                                        maxRows={10}
                                        onKeyDown={handleEnterPress}
                                        refs={textarea}
                                    />
                                    <div className="absolute bottom-3 right-3">
                                        <Button type="button" onClick={handleButtonClick} customClass="w-10 h-10 aspect-square" color={"white"} icon={
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                                 stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
                                            </svg>
                                        }/>
                                    </div>
                                </>

                            }

                            {(!responseLoading && activeConversationError) && (
                                <>
                                    <Button onClick={handleRegenerateResponse} color={'gray'} text={'Regenerate response'} icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                        </svg>
                                    } iconPosition={'left'}/>
                                </>


                            )}

                            { responseLoading &&
                                <Button color='gray'
                                        customClass="w-full h-full"
                                        onClick={handleStopResponse}
                                        text="Stop Response"
                                />
                            }
                        </div>
                    </div>
                </div>
        </>

    )
}