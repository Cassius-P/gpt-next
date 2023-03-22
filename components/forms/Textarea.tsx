import React, { MutableRefObject, TextareaHTMLAttributes } from 'react';
import TextareaAutosize from 'react-textarea-autosize'; 



interface CustomTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    maxRows?: number;
    refs?: any;
}


const TextArea: React.FC<CustomTextareaProps> = ({ maxRows = 10, refs, ...props }) => {



    return (
        
            <TextareaAutosize
                className="overflow-x-hidden block w-full p-1 pr-12 resize-none  focus:outline-none"
                placeholder="Enter your text here"
                onChange={props.onChange}
                value={props.value}
                minRows={1}
                maxRows={maxRows}
            />

    )
};

export default TextArea;