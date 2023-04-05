import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import Container from "../container/Container";
import Sidebar from "../sidebar/Sidebar";
import {useConversation} from "@/components/utils/ConversationContext";

export default function MainFrame({ children }: { children: ReactNode }) {

	const {conversations} = useConversation();

    return (
        <main className="flex flex-row flex-1 flex-grow h-screen">
            <Sidebar />
            <Container conversationID={'0'}>
                {children}
            </Container>
        </main>
    )
}
