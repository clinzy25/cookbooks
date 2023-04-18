import { api, fetcher } from '@/api'
import { AppContextType, SnackbarType } from '@/types/@types.context'
import { ICookbook } from '@/types/@types.cookbooks'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/router'
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
  const {
    query: { id },
    pathname,
  } = useRouter()
  const { user, error: userError, isLoading } = useUser()
  const [snackbar, setSnackbar] = useState<SnackbarType>({
    msg: '',
    state: '',
    duration: 3000,
  })
  const [cookbooks, setCookbooks] = useState<ICookbook[]>([])
  const [currentCookbook, setCurrentCookbook] = useState<ICookbook | null>(null)
  const [tags, setTags] = useState<string[]>([])

  const {
    data: tagsData,
    error: tagsError,
    mutate: revalidateTags,
  } = useSWR(pathname === '/cookbooks/[id]' && `${api}/tags?cookbook_guid=${id}`, fetcher)

  const {
    data: cookbooksData,
    error: cookbooksError,
    mutate: revalidateCookbooks,
  } = useSWR(!isLoading && !userError && `${api}/cookbooks?user_guid=${user?.sub}`, fetcher)
  
  useEffect(() => {
    tagsData && setTags(tagsData)
  }, [tagsData])

  useEffect(() => {
    cookbooksData && setCookbooks(cookbooksData)
  }, [cookbooksData])

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
        currentCookbook,
        setCurrentCookbook,
        snackbar,
        setSnackbar,
        revalidateCookbooks,
        tags,
        tagsError,
        revalidateTags,
      }}>
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => useContext(AppContext)

export default useAppContext
