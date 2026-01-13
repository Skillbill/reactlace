import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { initializeIcons } from '../shoelace'

interface ReactlaceContextValue {
  initialized: boolean
}

const ReactlaceContext = createContext<ReactlaceContextValue>({ initialized: false })

export interface ReactlaceProviderProps {
  children: ReactNode
  iconLibrary?: 'mdi' | 'shoelace'
}

export function ReactlaceProvider({ children, iconLibrary = 'mdi' }: ReactlaceProviderProps) {
  useEffect(() => {
    initializeIcons(iconLibrary)
  }, [iconLibrary])

  return (
    <ReactlaceContext.Provider value={{ initialized: true }}>
      {children}
    </ReactlaceContext.Provider>
  )
}

export function useReactlace() {
  return useContext(ReactlaceContext)
}
