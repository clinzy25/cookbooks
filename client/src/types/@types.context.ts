import { ICookbook } from './@types.cookbooks'
import { IUser } from './@types.user'

export type AppContextType = {
  cookbooks: ICookbook[]
  user: IUser
  cookbooksLoading: boolean
  cookbooksError: boolean
  setUser: (user: IUser) => void
  getCookbooks: (user_id: string) => void
}
