import React, {FC, createContext, useState} from 'react'
import { useMounted } from '@/hooks'

export interface AppComponentsContextType {
  isNavbarOpen: boolean
  setNavbarState?: (value: boolean) => void
}

type ContextWrapperProps = {
    children: JSX.Element
}


const defaultValue: AppComponentsContextType = {
 isNavbarOpen: false
}

export const AppComponentsContext = createContext<AppComponentsContextType>(defaultValue)

export const AppComponentsContextWrapper: FC<ContextWrapperProps> = ({ children }) => {
  const [isNavbarOpen, setIsNavBarOpen] = useState<boolean>(false)
  const setNavbarState: AppComponentsContextType['setNavbarState'] = (value: boolean) => {
    console.log(value)
    setIsNavBarOpen(value)
  }
  return (
    <AppComponentsContext.Provider value={{
      isNavbarOpen,
      setNavbarState
    }}>
      {children}
    </AppComponentsContext.Provider>
  )
  
}
