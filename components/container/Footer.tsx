import { ChangeEvent, TextareaHTMLAttributes, useEffect, useState, useRef, MutableRefObject } from "react"
import autosize from 'autosize';
import TextArea from "../forms/Textarea";
import Button from "../button/Button";
import { ButtonProps } from "flowbite-react";
import { useConversation } from "../utils/ConversationContext";
import { textChangeRangeIsUnchanged } from "typescript";


interface CustomTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    maxRows?: number;
}

export default function Footer() {

    const [text, setText] = useState('')

    const {submitMessage} = useConversation();
    const textarea = useRef<HTMLTextAreaElement>();

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value)
        //let size = autosize(e.target);
    }

    const handleButtonClick = async () => {
        let t = text
        if(t === '') return;

        console.log('Message =', t);
        let me = await submitMessage(t);
        setText('');
        console.log('Ref', textarea.current);
        
    }

    return (
        <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 z-0 bg-gray-100 border-t border-gray-200"></div>
            <div className="relative z-10 w-3/5 px-4 py-4">
                <div className=' relative rounded-lg shadow-md bg-white p-1'>
                    <TextArea
                        className="block w-full px-2 py-1 resize-none border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your text here"
                        onChange={handleChange}
                        value={text}
                        rows={1}
                        maxRows={5}
                        style={{ maxHeight: '200px' }}
                        refs={textarea}
                    />
                    <div className="absolute bottom-3 right-3 h-6 w-6">
                        <Button type="button" onClick={handleButtonClick} customClass="w-8 h-8" color={"gray"} icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        } />
                    </div>
                </div>




            </div>
        </div>
    )
}