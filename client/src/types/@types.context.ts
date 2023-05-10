import { KeyedMutator } from 'swr'
import { ITag } from './@types.tags'

export interface IAppContext {
  snackbar: ISnackbar
  setSnackbar: (snackbar: ISnackbar) => void
  tags: ITag[]
  tagsError: boolean
  revalidateTags: KeyedMutator<ITag[]>
  handleServerError: (e: unknown) => void
  isCookbookCreator: boolean
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
