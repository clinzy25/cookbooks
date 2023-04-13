import { ICookbook } from './@types.cookbooks'
import { IUser } from './@types.user'

export type AppContextType = {
  cookbooks: ICookbook[]
  cookbooksError: boolean
}
