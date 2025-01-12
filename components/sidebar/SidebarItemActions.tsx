import {useEffect, useState} from "react";

interface SidebarItemActionsProps {
    rename: {
        action?: (

        ) => void,
        confirmation?: ConfirmationProps
    }

    remove:{
        action?: () => void,
        confirmation?: ConfirmationProps
    }

    cancel: boolean
}

interface ConfirmationProps {
    action?: (isConfirmed: boolean) => void,
    state: boolean
}

export default function SidebarItemActions({rename, remove, cancel}: SidebarItemActionsProps) {

    const [isConfimation, setIsConfirmation] = useState(false)
    const [confirmationState, setConfirmationState] = useState<"ok" | "nok" | null>(null)
    const [action, setAction] = useState<"rename" | "remove" | null>(null)

    const [cancelAll, setCancelAll] = useState(cancel)

    useEffect(() => {
        if(cancelAll === true){
            handleCancel()
            setCancelAll(false)
        }
    }, [cancelAll])

    const handleRename = () => {
        if(rename.confirmation?.state){
            setIsConfirmation(true)
            setAction("rename")
        }
        if(rename.action){
            rename.action();
        }
    }

    const handleDelete = () => {
        if(remove.confirmation?.state){
            setIsConfirmation(true)
            setAction("remove")
        }
        if(remove.action){
            remove.action();
        }
    }

    const handleConfirm = () => {
        setIsConfirmation(false)
        setAction(null)
        if(action === "rename"){
            // @ts-ignore
            rename?.confirmation?.action(true)
        }
        if(action === "remove"){
            // @ts-ignore
            remove?.confirmation?.action(true)
        }
    }

    const handleCancel = () => {
        setIsConfirmation(false)
        setAction(null)
        if(action === "rename"){
            // @ts-ignore
            rename?.confirmation?.action(false)
        }
        if(action === "remove"){
            // @ts-ignore
            remove?.confirmation?.action(false)
        }
    }

    return !isConfimation ? (
        <>
            <button onClick={handleRename} className="text-gray-400 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg"
                     fill="none" viewBox="0 0 24 24"
                     strokeWidth={1.5} stroke="currentColor"
                     className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>

            </button>
            <button onClick={handleDelete} className="text-gray-400 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     strokeWidth={1.5} stroke="currentColor"
                     className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
            </button>
        </>
    ) : (
        <>
            <button onClick={handleConfirm} className="text-gray-400 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     strokeWidth={1.5} stroke="currentColor"
                     className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
            </button>
            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     strokeWidth={1.5} stroke="currentColor"
                     className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

        </>
    )

}