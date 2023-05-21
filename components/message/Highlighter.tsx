
import Markdown from 'markdown-to-jsx';
import CodeBlock from "@/components/container/CodeBlock";

export default function Highlighter({text, isLoading}: { text: string, isLoading: boolean }) {




    return (
        <div className={`markdown ${isLoading ? 'result-loading' : ''}`}>
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