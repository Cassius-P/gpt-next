import {Fragment, useEffect, useState} from 'react'
import {MagnifyingGlassIcon} from '@heroicons/react/20/solid'
import {FaceFrownIcon, GlobeAmericasIcon} from '@heroicons/react/24/outline'
import {Combobox, Dialog, Transition} from '@headlessui/react'
import {useUI} from "@/components/UIContext";
import Link from "next/link";
import {router} from "next/client";
import {useRouter} from "next/router";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


interface MessageResult {
    id: string;
    conversationID: string;
    text: string;

    date?: string;
}

interface ConversationResult {
    id: string;
    title: string;

}

interface ResponseResult {
    conversations: ConversationResult[];
    messages: MessageResult[];
    error?: string;

}

const Q_LEN = 3

enum COMMANDS {
    MSG = '#',
    CONV = '@',
}


const formatDate = (date: Date) => {

        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;

}


export default function Search() {
    const [query, setQuery] = useState('')
    const [open, setOpen] = useState(true)
    const [conversationResults, setConversationResults] = useState<ConversationResult[]>([])
    const [messagesResults, setMessagesResults] = useState<MessageResult[]>([])
    const [startDate, setStartDate] = useState<string>(null)
    const [endDate, setEndDate] = useState<string>(null)
    const [minLength, setMinLength] = useState<number>(Q_LEN)


    const {closeModal} = useUI();
    const router = useRouter()


    useEffect(() => {
        if (query.startsWith(COMMANDS.MSG) || query.startsWith(COMMANDS.CONV)) {
            console.log("Command detected")
            setMinLength(Q_LEN + 1)


        } else {
            setMinLength(Q_LEN)
        }
        console.log("New min length: ", minLength)

    }, [query]);


    const handleClose = async (e: boolean) => {
        setOpen(e);
    }

    const handleLinkClick = (e) => {

        handleClose(false).then( () => {
            closeModal();
        })
    }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setQuery(e.target.value)
        fetchResults(e.target.value).then(
            (results) => {
                if (results === undefined) return;

                let conversations: ConversationResult[], messages: MessageResult[]
                ({conversations, messages} = results);
                setConversationResults(conversations)
                setMessagesResults(messages)
            }
        )
    }

    const fetchResults = async (text: string | null) => {

        if (text === null) {
            text = query
        }
        ;

        if (text == COMMANDS.MSG || text == COMMANDS.CONV) {
            return;
        }

        if (text === '' || text === null || text.length < minLength) {
            setConversationResults([])
            setMessagesResults([])

            return;
        }

        try {
            let results = await fetch(getUrlFromText(text));
            let res: ResponseResult = await results.json();


            console.log("Search results", res)

            return res;
        } catch (e) {
            console.log("Error fetching search results", e)
        }
    }


    const formatText = (text: string) => {
        let preIndex = text.indexOf('<strong>')
        let postIndex = text.indexOf('</strong>')

        if (preIndex == -1 || postIndex == -1) {
            return text;
        }

        let wordCount = text.split(' ').length;
        let median = Math.ceil((text.length / wordCount));

        const nbAround = 6.3

        let start = preIndex - median* nbAround;
        let end = postIndex + median* nbAround;

        if(start < 0){
            start = 0;
            end = postIndex + median* nbAround*1.7
        }

        if(end > text.length){
            end = text.length;
            start = preIndex - median* nbAround*1.6
        }



        text = text.substring(start, end);

        if(start > 0 ){
            text = text.substring(Math.min(text.length, text.indexOf(" ")), text.length)
        }

        if(end < text.length){
            text = text.substring(0, Math.min(text.length, text.lastIndexOf(" ")))
        }


        console.log("Formatted text", text)
        return text;
    }


    const getUrlFromText = (text: string) => {

        let args = []
        let isCommand = false;
        if (text.startsWith(COMMANDS.MSG)) {
            isCommand = true;
            args.push("mode=1");
        }

        if (text.startsWith(COMMANDS.CONV)) {
            isCommand = true;
            args.push("mode=0");
        }

        if (isCommand) {
            text = text.substring(1);
        }

        if (startDate != null) {
            args.push(`from=${startDate}`)
        }

        if (endDate != null) {
            args.push(`to=${endDate}`)
        }


        let base = `/api/search?q=${text}`;

        if (args.length > 0) {
            base += `&${args.join('&')}`;
        }


        return base;

    }

    return (
        <Transition.Root show={open} as={Fragment} afterLeave={() => {
            setQuery('')
            closeModal();
        }} appear>
            <Dialog as="div" className="relative z-30" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 backdrop-blur-sm transition ease-in-out"/>
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel
                            className="mx-auto max-w-xl transform overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
                            <Combobox onChange={(item) => (console.log("OnChange", item))}>
                                <div className="relative">
                                    <MagnifyingGlassIcon
                                        className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                    <Combobox.Input
                                        className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm outline-none"
                                        placeholder="Search..."
                                        onChange={handleChange}
                                    />
                                </div>

                                {(query === '' || query.length < minLength) && (
                                    <div className="border-t border-gray-100 px-6 py-14 text-center text-sm sm:px-14">
                                        <GlobeAmericasIcon className="mx-auto h-6 w-6 text-gray-400"
                                                           aria-hidden="true"/>
                                        <p className="mt-4 font-semibold text-gray-900">Search for messages and
                                            chat rooms</p>
                                        <p className="mt-2 text-gray-500">
                                            Quickly access chat rooms and messages by running a global search.
                                        </p>
                                    </div>
                                )}


                                {(messagesResults.length > 0 || conversationResults.length > 0) && (


                                    <div className={`flex flex-col space-y-5`}>
                                        {(messagesResults.length > 0) && (
                                            <Combobox.Options static
                                                              className="max-h-80 scroll-pb-2 scroll-pt-11 space-y-1 overflow-y-auto">
                                                <h2 className="bg-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-900">Messages</h2>

                                                <li className={`m-0 flex-col flex px-1`}>
                                                    {messagesResults.map((message, index) => (


                                                            <Link  key={index}
                                                                   href={`${message.conversationID}#${message.id}`}
                                                                   scroll={true}
                                                                  className={` outline-none p-2 text-sm text-gray-800 hover:bg-gray-200 rounded-md h-full w-full whitespace-nowrap text-clip overflow-hidden flex`}
                                                                  onClick={handleLinkClick}>
                                                                    <div className={'aspect-square rounded-md p-2 bg-white'}>
                                                                        <span className={''}>
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                fill="none"
                                                                                viewBox="0 0 24 24"
                                                                                strokeWidth={1.5}
                                                                                stroke="currentColor"
                                                                                className="w-6 h-6 text-gray-400">
                                                                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                                                            </svg>
                                                                        </span>
                                                                    </div>
                                                                    <div className={'flex flex-col flex-grow ml-2'}>
                                                                        <span className={'text-gray-900 font-semibold'}>{message.date && (formatDate(new Date(message.date)))} - {message.id}</span>
                                                                        <span className={'text-gray-900'} dangerouslySetInnerHTML={{__html: message.text}}></span>
                                                                    </div>
                                                            </Link>

                                                    ))}
                                                </li>

                                            </Combobox.Options>
                                        )}

                                        {(conversationResults.length > 0) && (
                                            <Combobox.Options static
                                                              className="max-h-80 scroll-pb-2 scroll-pt-11 space-y-1 overflow-y-auto">
                                                <h2 className="bg-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-900">Chat</h2>

                                                <li className={`m-0 flex-col flex px-1`}>
                                                    {conversationResults.map((conversation, index) => (

                                                        <Link key={index} href={conversation.id}
                                                              className={`p-2 text-sm text-gray-800 hover:bg-gray-200 rounded-md h-full w-full whitespace-nowrap text-clip overflow-hidden flex`}
                                                              onClick={handleLinkClick}>
                                                            <div className={'aspect-square rounded-md p-2 bg-white'}>
                                                                        <span className={''}>
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                fill="none"
                                                                                viewBox="0 0 24 24"
                                                                                strokeWidth={1.5}
                                                                                stroke="currentColor"
                                                                                className="w-6 h-6 text-gray-400">
                                                                              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                                                            </svg>

                                                                        </span>
                                                            </div>
                                                            <div className={'flex items-center flex-grow ml-2'}>
                                                                <span className={'text-gray-900'}> {conversation.title}</span>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </li>

                                            </Combobox.Options>
                                        )}
                                    </div>


                                )}


                                {query !== '' && query.length >= minLength && conversationResults.length === 0 && messagesResults.length === 0 && (
                                    <div className="border-t border-gray-100 px-6 py-14 text-center text-sm sm:px-14">
                                        <FaceFrownIcon className="mx-auto h-6 w-6 text-gray-400" aria-hidden="true"/>
                                        <p className="mt-4 font-semibold text-gray-900">No results found</p>
                                        <p className="mt-2 text-gray-500">We couldn’t find anything with that term.
                                            Please try again.</p>
                                    </div>
                                )}

                                <div
                                    className="flex flex-wrap items-center bg-gray-50 px-4 py-2.5 text-xs text-gray-700 mt-2">
                                    Type{' '}
                                    <kbd
                                        className={classNames(
                                            'mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold sm:mx-2',
                                            query.startsWith('#') ? 'border-blue-300 text-blue-300' : 'border-gray-400 text-gray-900'
                                        )}
                                    >
                                        #
                                    </kbd>{' '}
                                    <span className="sm:hidden">for messages,</span>
                                    <span className="hidden sm:inline">to access messages,</span>
                                    <kbd
                                        className={classNames(
                                            'mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold sm:mx-2',
                                            query.startsWith('@') ? 'border-blue-300 text-blue-300' : 'border-gray-400 text-gray-900'
                                        )}
                                    >
                                        @
                                    </kbd>{' '}
                                    for chats
                                </div>
                            </Combobox>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>


    )
}