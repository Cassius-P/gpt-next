import { ReactNode} from "react";
import Container from "../container/Container";
import Sidebar from "../sidebar/Sidebar";

export default function MainFrame({ children }: { children: ReactNode }) {


    return (
        <main className="flex flex-row flex-1 flex-grow h-screen">
            <Sidebar />
            <Container conversationID={'0'}>
                <div className="flex flex-col py-4 overflow-auto relative" id="chat-container" >
                {children}
                </div>
            </Container>
        </main>
    )
}
