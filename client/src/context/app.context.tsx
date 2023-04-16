import { api, fetcher } from '@/api'
import { AppContextType, SnackbarType } from '@/types/@types.context'
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
  const [snackbar, setSnackbar] = useState<SnackbarType>({
    msg: '',
    state: '',
    duration: 3000,
  })
  const [cookbooks, setCookbooks] = useState<ICookbook[]>([])
  const [cookbooksError, setCookbooksError] = useState(false)

  // prettier-ignore
  const { data, error, mutate: revalidateCookbooks } = useSWR(
    !isLoading && !userError && `${api}/cookbooks?user_guid=${user?.sub}`,
    fetcher
  )

  useEffect(() => {
    data && setCookbooks(data)
    error && setCookbooksError(error)
  }, [data, error])

  useEffect(() => {
    const timeout = setTimeout(
      () => setSnackbar({ msg: '', state: '', duration: 3000 }),
      snackbar.duration
    )
    return () => clearTimeout(timeout)
  }, [snackbar])

  return (
    <AppContext.Provider
      value={{
        cookbooks,
        cookbooksError,
        snackbar,
        setSnackbar,
        revalidateCookbooks,
      }}>
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => useContext(AppContext)

export default useAppContext
