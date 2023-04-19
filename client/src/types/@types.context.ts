import { ICookbook } from './@types.cookbooks'

export type AppContextType = {
  cookbooks: ICookbook[]
  cookbooksError: boolean
  currentCookbook: ICookbook | null
  setCurrentCookbook: (cookbook: ICookbook | null) => void
  snackbar: SnackbarType
  setSnackbar: (snackbar: SnackbarType) => void
  revalidateCookbooks: () => void
  tags: string[]
  tagsError: boolean
  revalidateTags: () => void
  navbarHeight: number
}

export type SnackbarType = {
  msg: string
  state: 'success' | 'error' | ''
  duration: number
}
