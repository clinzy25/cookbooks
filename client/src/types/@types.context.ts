import { KeyedMutator } from 'swr'
import { ICookbookRes } from './@types.cookbooks'
import { ITag } from './@types.tags'

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
  revalidateTags: KeyedMutator<ITag[]>
}

export interface ISnackbar {
  msg: string
  state: 'success' | 'error' | ''
  duration?: number
}
