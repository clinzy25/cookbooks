import { api, fetcher } from '@/api'
import { IAppContext, ISnackbar } from '@/types/@types.context'
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
  const { user } = useUser()
  const [snackbar, setSnackbar] = useState<ISnackbar>({ msg: '', state: '' })
  const [isCookbookCreator, setIsCookbookCreator] = useState(false)
  const [tags, setTags] = useState<ITag[]>([])
  const [tagsLimit] = useState(20)
  const [tagsOffset, setTagsOffset] = useState(0)
  const [isEndOfTags, setIsEndOfTags] = useState(false)

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

  const handleTags = () => {
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
    if (pathname.includes('/cookbooks/[cookbook]')) {
      return `${api}/tags?cookbook_guid=${cookbook}&limit=${tagsLimit}&offset=${tagsOffset}`
    }
    if (pathname === '/cookbooks') {
      return `${api}/tags?user_guid=${user?.sub}&limit=${tagsLimit}&offset=${tagsOffset}`
    }
  }

  const {
    data: tagsData,
    error: tagsError,
    mutate: revalidateTags,
  } = useSWR(getTagsQuery(), fetcher)

  useEffect(() => {
    handleTags()
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
        snackbar,
        setSnackbar,
        tags,
        tagsError,
        revalidateTags,
        handleServerError,
        isCookbookCreator,
        tagsOffset,
        tagsLimit,
        isEndOfTags,
        setTagsOffset,
      }}>
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => useContext(AppContext)

export default useAppContext
