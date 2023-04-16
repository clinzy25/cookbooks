export const INVALID_URL = 'errors/invalid-url'
export const INVALID_URL_MSG = 'Invalid URL'

export const RECIPE_NOT_FOUND = 'errors/recipe-not-found'
export const RECIPE_NOT_FOUND_MSG = 'Could not get a recipe from link'

export const INTERNAL_SERVER_ERROR = 'errors/internal-server-error'
export const INTERNAL_SERVER_ERROR_MSG = 'Something went wrong'

export const serverErrorMessages = new Map()
serverErrorMessages.set(INVALID_URL, INVALID_URL_MSG)
serverErrorMessages.set(RECIPE_NOT_FOUND, RECIPE_NOT_FOUND_MSG)
serverErrorMessages.set(INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MSG)