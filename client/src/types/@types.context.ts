import { ICookbook } from './@types.cookbooks'

export type AppContextType = {
  cookbooks: ICookbook[]
  cookbooksError: boolean
  snackbar: SnackbarType
  setSnackbar: (snackbar: SnackbarType) => void
  revalidateCookbooks: () => void
}

export type SnackbarType = {
  msg: string
  state: 'success' | 'error' | ''
  duration: number
}
