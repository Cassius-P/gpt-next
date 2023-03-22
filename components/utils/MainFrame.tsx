import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import Container from "../container/Container";
import Sidebar from "../sidebar/Sidebar";

export default function MainFrame({ children }: { children: ReactNode }) {

	const [conversations, setConversations] = useState([])

    const getConversations = async () => {
        let res: Response = await fetch('/api/conversations')
        let data = await res.json()
        let message = data.message;
        console.log('Conversations', message)
        return message;
    }

    

    useEffect(() => {
        getConversations().then((data) => {
            setConversations(data)
        });
    }, [])



    



    


    return (
        <main className="flex flex-row flex-1 flex-grow h-screen">
            <Sidebar conversations={conversations} />
            <Container conversationID={'0'}>
                {children}
            </Container>
        </main>
    )
}
