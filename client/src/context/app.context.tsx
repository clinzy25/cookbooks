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
    query: { cookbook },
    pathname,
  } = useRouter()
  const { user, error: userError, isLoading } = useUser()
  const [snackbar, setSnackbar] = useState<ISnackbar>({ msg: '', state: '' })
  const [tags, setTags] = useState<ITag[]>([])
  const [tagsLimit] = useState(20)
  const [tagsOffset, setTagsOffset] = useState(0)
  const [isEndOfTags, setIsEndOfTags] = useState(false)
  const [cookbooks, setCookbooks] = useState<ICookbookRes[]>([])
  const [tagsEditMode, setTagsEditMode] = useState(false)

  /**
   * Catch a server error of a specific type
   * and display an associated response in UI
   */
  const handleServerError = (e: unknown) => {
    console.error(e)
    if (e instanceof AxiosError) {
      const errorKey = e.response?.data.type
      if (serverErrorMessageMap.has(errorKey)) {
        return setSnackbar({ msg: serverErrorMessageMap.get(errorKey), state: 'error' })
      }
    }
    return setSnackbar({ msg: GENERIC_RES, state: 'error' })
  }

  const handleTags = (tagsData: ITag[]) => {
    if (tagsData) {
      tagsData.length < tagsLimit && setIsEndOfTags(true)
      if (tagsOffset === 0) {
        setTags(tagsData)
      } else {
        setTags([...tags, ...tagsData])
      }
    }
  }

  const getTagsQuery = () => {
    const commonParams = `limit=${tagsLimit}&offset=${tagsOffset}`
    const globalTagsRoutes = ['/cookbooks', '/search']
    if (pathname.includes('/cookbooks/[cookbook]')) {
      return `${api}/tags?cookbook_guid=${cookbook}&${commonParams}`
    }
    if (globalTagsRoutes.includes(pathname)) {
      return `${api}/tags?user_guid=${user?.sub}&${commonParams}`
    }
  }

  const {
    data: tagsData,
    error: tagsError,
    mutate: revalidateTags,
  } = useSWR(!isLoading && !userError && getTagsQuery(), fetcher)

  const {
    data: cookbooksData,
    error: cookbooksError,
    mutate: revalidateCookbooks,
  } = useSWR(!isLoading && !userError && `${api}/cookbooks?user_guid=${user?.sub}`, fetcher)

  useEffect(() => {
    cookbooksData && setCookbooks(cookbooksData)
  }, [cookbooksData])

  useEffect(() => {
    tagsData && handleTags(tagsData)
  }, [tagsData]) // eslint-disable-line

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    if (snackbar.state) {
      timeout = setTimeout(() => setSnackbar({ msg: '', state: '' }), SNACKBAR_DURATION_MS)
    }
    return () => timeout && clearTimeout(timeout)
  }, [snackbar])

  return (
    <AppContext.Provider
      value={{
        cookbooks,
        cookbooksError,
        revalidateCookbooks,
        snackbar,
        setSnackbar,
        tags,
        tagsError,
        revalidateTags,
        handleServerError,
        tagsOffset,
        tagsLimit,
        isEndOfTags,
        setTagsOffset,
        tagsEditMode,
        setTagsEditMode,
      }}>
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => useContext(AppContext)

export default useAppContext
