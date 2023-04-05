import ReactMarkdown, {Components} from "react-markdown";
import Markdown from 'markdown-to-jsx';
import CodeBlock from "@/components/container/CodeBlock";
import {useConversation} from "@/components/utils/ConversationContext";

export default function Highlighter({text, isLoading}: { text: string, isLoading: boolean }) {




    return (
        <div className={isLoading ? 'result-loading' : ''}>
            <Markdown options={
                {
                    disableParsingRawHTML: true ,
                    wrapper: 'section',
                    overrides: {
                        pre : {
                            component: CodeBlock
                        }
                    }
                }
            }>{text}</Markdown>
        </div>
    )


}