import React, {useCallback, useMemo, useState} from "react";
import { createContext, FC, ReactNode } from "react";

export interface UIState {
  displayModal: boolean;
  modalView: string;
}

const initialState = {
  displayModal: false,
  modalView: "LOGIN_VIEW",
}

type Action = 
  | { 
    type: "OPEN_MODAL" 
  }
  | { 
    type: "CLOSE_MODAL"
  }
  | {
    type: "SET_VIEW"
    view: VIEWS
  } | {
    type: "TOGGLE_THEME"
    theme: 'dark' | 'light'
  }

type VIEWS = 
  | "LOGIN_VIEW"
  | "REGISTER_VIEW"
  | "CONFIRMED_REGISTER_VIEW"
  | "SEARCH_VIEW"

export const UIContext = createContext<UIState | any>(initialState)
UIContext.displayName = "UIContext";

function uiReducer(state: UIState, action: Action) {
  switch (action.type) {
    case "OPEN_MODAL": {
      return {
        ...state,
        displayModal: true
      }
    }
    case "CLOSE_MODAL": {
      return {
        ...state,
        displayModal: false
      }
    }
    case "SET_VIEW": {
      return {
        ...state,
        modalView: action.view
      }
    }
    case "TOGGLE_THEME": {
      console.log('TOGGLE_THEME', action.theme)
      localStorage.setItem('theme', action.theme)
      return {
        ...state,
      }
    }
  }
}

export const UIProvider: FC<{ children?: ReactNode }> = (props) => {
  const [state, dispatch] = React.useReducer(uiReducer, initialState)

  const openModal = useCallback(
    () => dispatch({ type: "OPEN_MODAL" }),
    [dispatch]
  )

  const closeModal = useCallback(
    () => dispatch({ type: "CLOSE_MODAL" }),
    [dispatch]
  )

  const setModalView = useCallback(
    (view: VIEWS) => {
      dispatch({ type: "SET_VIEW", view })
    },
    [dispatch]
  )

  let initLightTheme = true
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    initLightTheme = false
  }


  const [lightMode, setLightMode] = useState(initLightTheme);

  const setTheme = useCallback(
    (theme: 'dark' | 'light') => {
        console.log('setTheme', theme)
        dispatch({ type: "TOGGLE_THEME", theme })
        setLightMode(theme === 'light')
    }, [dispatch])




  const values = useMemo(
    () => ({
      ...state,
      openModal,
      closeModal,
      setModalView,
      setTheme,
      lightMode,
    }),
    [state]
  )

  return <UIContext.Provider value={values} {...props} />
}

export const useUI = () => {
  const context = React.useContext(UIContext)
  if (context === undefined) {
    throw new Error(`useUI must be used within a UIProvider`)
  }
  return context
}

export const ManagedUIContext: FC<{ children?: ReactNode }> = ({
  children,
}) => (
  <UIProvider>
    {children}
  </UIProvider>
)