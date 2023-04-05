import React, {ReactNode, useEffect, useRef} from 'react'
import { useConversation } from '../utils/ConversationContext';
import Footer from './Footer'

interface ContainerProps {
	children: React.ReactNode;
    conversationID?: string;
}

const Container = ({ children }: ContainerProps) => {


    
    
    return (
        <div className="flex flex-col flex-1 flex-grow">
            <div className="grid grid-cols-1 grid-rows-[1fr,auto] h-full">
                    {children}
                <Footer/>
            </div>
        </div>
    )
}

export default Container