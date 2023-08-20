import React, { useState, useCallback, type FC, type ReactNode, useContext } from 'react'

export const APIRefreshContext = React.createContext({
  refreshToken: Date.now(),
  refresh: () => {}
})

interface APIRefreshProviderProps {
  children: ReactNode
}

export const APIRefreshProvider: FC<APIRefreshProviderProps> = ({ children }) => {
  const [refreshToken, setRefreshToken] = useState(Date.now())

  const refresh = (): void => { setRefreshToken(Date.now()) }

  const contextValue = {
    refreshToken,
    refresh: useCallback(() => { refresh() }, [])
  }

  return (
    <APIRefreshContext.Provider value={contextValue}>
      {children}
    </APIRefreshContext.Provider>
  )
}

export const useRefreshNotifier = (): {
  refreshToken: number
  refresh: () => void
} =>
  useContext(APIRefreshContext)
