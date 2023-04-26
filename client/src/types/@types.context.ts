import { ICookbookRes } from './@types.cookbooks'

export interface IAppContext {
  cookbooks: ICookbookRes[]
  cookbooksError: boolean
  currentCookbook: ICookbookRes | null
  setCurrentCookbook: (cookbook: ICookbookRes | null) => void
  snackbar: ISnackbar
  setSnackbar: (snackbar: ISnackbar) => void
  revalidateCookbooks: () => void
  tags: ITag[]
  tagsError: boolean
  revalidateTags: () => void
}

export interface ITag {
  tag_name: string
  guid: string
}

export interface ISnackbar {
  msg: string
  state: 'success' | 'error' | ''
  duration: number
}
