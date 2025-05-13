'use client';

import React, { createContext, useState } from 'react'

export interface AppComponentsContextType {
  // Add any app-wide state here
  theme: 'light' | 'dark'
  toggleTheme?: () => void
}

type ContextWrapperProps = {
  children: React.ReactNode
}

const defaultValue: AppComponentsContextType = {
  theme: 'dark'
}

export const AppComponentsContext = createContext<AppComponentsContextType>(defaultValue)

export const AppComponentsContextWrapper = ({ children }: ContextWrapperProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
  }
  
  return (
    <AppComponentsContext.Provider value={{
      theme,
      toggleTheme
    }}>
      {children}
    </AppComponentsContext.Provider>
  )
}
