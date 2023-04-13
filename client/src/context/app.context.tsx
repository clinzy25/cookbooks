import { api, fetcher } from '@/api'
import { AppContextType } from '@/types/@types.context'
import { ICookbook } from '@/types/@types.cookbooks'
import { useUser } from '@auth0/nextjs-auth0/client'
import React, {
  useContext,
  createContext,
  FC,
  useState,
  PropsWithChildren,
  useEffect,
} from 'react'
import useSWR from 'swr'

export const AppContext = createContext<AppContextType | null>(null)

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const { user, error: userError, isLoading } = useUser()
  const [cookbooks, setCookbooks] = useState<ICookbook[]>([])
  const [cookbooksError, setCookbooksError] = useState(false)

  const { data, error } = useSWR(
    !isLoading && !userError && `${api}/cookbooks?user_guid=${user?.sub}`,
    fetcher
  )

  useEffect(() => {
    data && setCookbooks(data)
    error && setCookbooksError(error)
  }, [data, error])

  return (
    <AppContext.Provider
      value={{
        cookbooks,
        cookbooksError,
      }}>
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => useContext(AppContext)

export default useAppContext
