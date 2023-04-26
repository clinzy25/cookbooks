import { ICookbookRes } from './@types.cookbooks'

export type AppContextType = {
  cookbooks: ICookbookRes[]
  cookbooksError: boolean
  currentCookbook: ICookbookRes | null
  setCurrentCookbook: (cookbook: ICookbookRes | null) => void
  snackbar: SnackbarType
  setSnackbar: (snackbar: SnackbarType) => void
  revalidateCookbooks: () => void
  tags: ITag[]
  tagsError: boolean
  revalidateTags: () => void
  navbarHeight: number
}

export interface ITag {
  tag_name: string
  guid: string
}

export type SnackbarType = {
  msg: string
  state: 'success' | 'error' | ''
  duration: number
}
