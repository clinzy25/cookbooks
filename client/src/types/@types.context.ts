import { ICookbook } from './@types.cookbooks'

export type AppContextType = {
  cookbooks: ICookbook[]
  cookbooksError: boolean
}
