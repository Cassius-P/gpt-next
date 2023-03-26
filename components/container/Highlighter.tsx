import ReactMarkdown, {Components} from "react-markdown";
import Markdown from 'markdown-to-jsx';
import {useState} from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Button from "@/components/button/Button";
import CodeBlock from "@/components/container/CodeBlock";

export default function Highlighter({text}: { text: string }) {






    return (
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
        } >{text}</Markdown>
    )


}