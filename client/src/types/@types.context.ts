import { ICookbookRes } from './@types.cookbooks'
import { ITagRes } from './@types.tags'

export type AppContextType = {
  cookbooks: ICookbookRes[]
  cookbooksError: boolean
  currentCookbook: ICookbookRes | null
  setCurrentCookbook: (cookbook: ICookbookRes | null) => void
  snackbar: SnackbarType
  setSnackbar: (snackbar: SnackbarType) => void
  revalidateCookbooks: () => void
  tags: ITagRes[]
  tagsError: boolean
  revalidateTags: () => void
  navbarHeight: number
}

export type SnackbarType = {
  msg: string
  state: 'success' | 'error' | ''
  duration: number
}
