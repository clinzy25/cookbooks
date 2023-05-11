import { KeyedMutator } from 'swr'
import { ITag } from './@types.tags'
import { ICookbookRes } from './@types.cookbooks'

export interface IAppContext {
  cookbooks: ICookbookRes[]
  cookbooksError: boolean
  revalidateCookbooks: () => void
  snackbar: ISnackbar
  setSnackbar: (snackbar: ISnackbar) => void
  tags: ITag[]
  tagsError: boolean
  revalidateTags: KeyedMutator<ITag[]>
  handleServerError: (e: unknown) => void
  tagsOffset: number
  tagsLimit: number
  isEndOfTags: boolean
  setTagsOffset: (offset: number) => void
}

export interface ISnackbar {
  msg: string
  state: 'success' | 'error' | ''
  duration?: number
}
