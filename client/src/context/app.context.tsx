import { api, fetcher } from '@/api'
import { IAppContext, ISnackbar } from '@/types/@types.context'
import { ICookbookRes } from '@/types/@types.cookbooks'
import { ITag } from '@/types/@types.tags'
import { SNACKBAR_DURATION_MS } from '@/utils/utils.constants'
import { GENERIC_RES, serverErrorMessageMap } from '@/utils/utils.errors.server'
import { useUser } from '@auth0/nextjs-auth0/client'
import { AxiosError } from 'axios'
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

export const AppContext = createContext<IAppContext | null>(null)

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const {
    query: { id },
    pathname,
  } = useRouter()
  const { user, error: userError, isLoading } = useUser()
  const [snackbar, setSnackbar] = useState<ISnackbar>({ msg: '', state: '' })
  const [cookbooks, setCookbooks] = useState<ICookbookRes[]>([])
  const [currentCookbook, setCurrentCookbook] = useState<ICookbookRes | null>(null)
  const [tags, setTags] = useState<ITag[]>([])

  /**
   * Catch a server error of a specific type
   * and display an associated response in UI
   */
  const handleServerError = (e: unknown) => {
    console.error(e)
    if (e instanceof AxiosError) {
      const errorKey = e.response?.data.type
      if (serverErrorMessageMap.has(errorKey)) {
        setSnackbar({ msg: serverErrorMessageMap.get(errorKey), state: 'error' })
      } else {
        setSnackbar({ msg: GENERIC_RES, state: 'error' })
      }
    } else {
      setSnackbar({ msg: GENERIC_RES, state: 'error' })
    }
  }

  const getTagsQuery = () =>
    currentCookbook
      ? pathname === '/cookbooks/[id]' && `${api}/tags?cookbook_guid=${id}`
      : pathname === '/cookbooks' && `${api}/tags?user_guid=${user?.sub}`

  const {
    data: tagsData,
    error: tagsError,
    mutate: revalidateTags,
  } = useSWR(getTagsQuery(), fetcher)

  const {
    data: cookbooksData,
    error: cookbooksError,
    mutate: revalidateCookbooks,
  } = useSWR(!isLoading && !userError && `${api}/cookbooks?user_guid=${user?.sub}`, fetcher)

  useEffect(() => {
    cookbooksData && setCookbooks(cookbooksData.data)
  }, [cookbooksData])

  useEffect(() => {
    tagsData && setTags(tagsData)
  }, [tagsData])

  useEffect(() => {
    const timeout = setTimeout(() => setSnackbar({ msg: '', state: '' }), SNACKBAR_DURATION_MS)
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
        handleServerError
      }}>
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => useContext(AppContext)

export default useAppContext
