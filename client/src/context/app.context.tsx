import { api, fetcher } from '@/api'
import { AppContextType } from '@/types/@types.context'
import { ICookbook } from '@/types/@types.cookbooks'
import { IUser } from '@/types/@types.user'
import React, {
  useContext,
  createContext,
  FC,
  useState,
  PropsWithChildren,
  useCallback,
} from 'react'

export const AppContext = createContext<AppContextType | null>(null)

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<IUser>({
    id: 1,
    guid: '9bf35a8e-699b-44d2-a4a0-935a5f916e3a',
    username: 'clinzy',
    email: 'clinzy1@protonmail.com',
    is_readonly: 0,
    created_at: '',
    updated_at: '',
  })
  const [cookbooks, setCookbooks] = useState<ICookbook[]>([])
  const [cookbooksLoading, setCookbooksLoading] = useState(false)
  const [cookbooksError, setCookbooksError] = useState(false)

  const getCookbooks = useCallback(async (user_guid: string) => {
    try {
      setCookbooksLoading(true)
      const data = await fetcher(`${api}/cookbooks?user_guid=${user_guid}`)
      setCookbooks(data)
    } catch (e) {
      console.error(e)
      setCookbooksError(true)
    }
    setCookbooksLoading(false)
  }, [])

  return (
    <AppContext.Provider
      value={{
        cookbooks,
        user,
        setUser,
        getCookbooks,
        cookbooksLoading,
        cookbooksError,
      }}>
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => useContext(AppContext)

export default useAppContext
