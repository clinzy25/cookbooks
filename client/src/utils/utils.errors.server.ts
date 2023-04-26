import { ISnackbar } from '@/types/@types.context'
import { AxiosError } from 'axios'

/**
 * Catch a server error of a specific type
 * and display an associated response in UI
 */
export const serverErrorMessage = (e: unknown, setSnackbar: (config: ISnackbar) => void) => {
  console.error(e)
  if (e instanceof AxiosError) {
    const errorKey = e.response?.data.type
    setSnackbar({
      msg: serverErrorMessageMap.get(errorKey),
      state: 'error',
      duration: 3000,
    })
  }
}
/**
 * ERROR_TYPE = /server/utils/utils.errors **MUST MATCH**
 * ERROR_TYPE_MSG = 'Message to display to the user'
 */
const GENERIC_RES = 'Something went wrong'

export const INVALID_URL = 'errors/invalid-url'
export const INVALID_URL_MSG = 'Invalid URL'

export const RECIPE_NOT_FOUND = 'errors/recipe-not-found'
export const RECIPE_NOT_FOUND_MSG = 'Could not get a recipe from link'

export const INTERNAL_SERVER_ERROR = 'errors/internal-server-error'
export const INTERNAL_SERVER_ERROR_MSG = GENERIC_RES

export const FAILED_TO_CREATE_RESOURCE = 'errors/failed-to-create-resource'
export const FAILED_TO_CREATE_RESOURCE_MSG = GENERIC_RES

export const INCOMPLETE_REQUEST_BODY = 'errors/incomplete-request-body'
export const INCOMPLETE_REQUEST_BODY_MSG = GENERIC_RES

export const serverErrorMessageMap = new Map()
serverErrorMessageMap.set(INVALID_URL, INVALID_URL_MSG)
serverErrorMessageMap.set(RECIPE_NOT_FOUND, RECIPE_NOT_FOUND_MSG)
serverErrorMessageMap.set(INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MSG)
serverErrorMessageMap.set(FAILED_TO_CREATE_RESOURCE, FAILED_TO_CREATE_RESOURCE_MSG)
