import { ICookbook } from './@types.cookbooks'
import { IUser } from './@types.user'

export type AppContextType = {
  cookbooks: ICookbook[]
  user: IUser
  setUser: (user: IUser) => void
  createCookbook: (cookbook: ICookbook) => void
  updateCookbook: (id: number) => void
  deleteCookbook: (id: number) => void
  setCookbooks: (cookbooks: ICookbook[]) => void
}
