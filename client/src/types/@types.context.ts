import { ICookbook } from './@types.cookbooks'
import { IUser } from './@types.user'

export type AppContextType = {
  user: IUser
  setUser: (user: IUser) => void
  cookbooks: ICookbook[]
  cookbooksError: boolean
}
