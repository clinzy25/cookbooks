import { AppContextType } from '@/types/@types.context'
import { ICookbook } from '@/types/@types.cookbooks'
import { IUser } from '@/types/@types.user'
import React, {
  useContext,
  createContext,
  FC,
  useState,
  PropsWithChildren,
} from 'react'

export const AppContext = createContext<AppContextType | null>(null)

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<IUser>({
    id: 1,
    username: 'clinzy',
    email: 'clinzy1@protonmail.com',
    is_readonly: 0,
    created_at: '',
    updated_at: '',
  })
  const [cookbooks, setCookbooks] = useState<ICookbook[]>([])

  const createCookbook = () => {
    return
  }
  const updateCookbook = () => {
    return
  }
  const deleteCookbook = () => {
    return
  }

  return (
    <AppContext.Provider
      value={{
        cookbooks,
        user,
        setUser,
        setCookbooks,
        createCookbook,
        updateCookbook,
        deleteCookbook,
      }}>
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => useContext(AppContext)

export default useAppContext
