import {createContext, ReactNode, useContext, useEffect} from "react";
import Mousetrap from "mousetrap"
import {useUI} from "@/contexts/UIContext";

export const KeyboardContext = createContext<any>({})
KeyboardContext.displayName = "KeyboardContext";


interface ShortCut {
    keys: string | string[],
    callback: () => void
    action?: "keypress" | "keydown" | "keyup"

}





export const KeyboardHandler = ({ children } : {children:ReactNode}) => {
    const {openModal, closeModal, setModalView, displayModal} = useUI();

    const toggleSearch: ShortCut = {
        keys: "alt+k",
        callback: async () => {
            let action = "Open"
            if(!displayModal) {
                openModal();
                setModalView("SEARCH_VIEW")
            }else {
                action = "Close"
                closeModal();
            }

            console.log(`${action} Search Modal`)
        }
    }

    Mousetrap.bind(toggleSearch.keys, toggleSearch.callback, toggleSearch.action)




    const shortcuts: ShortCut[] = [
        toggleSearch
    ]

    useEffect(() => {

        for (const argument of shortcuts) {
            if(!argument.action) argument.action = "keypress"

        }


    }, [displayModal])


    const removeBinds = (shortcut:ShortCut) => {
        Mousetrap.unbind(shortcut.keys)
    }


    return <KeyboardContext.Provider value={{removeBinds, toggleSearch}}>{children}</KeyboardContext.Provider>
}

export const useKeyboard = () => useContext(KeyboardContext);