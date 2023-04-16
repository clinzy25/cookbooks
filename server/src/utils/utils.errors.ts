import { Response } from 'express'

type ExceptionResponseType = {
  statusCode: number
  body: {
    type: string
    detail: string
  }
}

export const errorHandler = (error: Error, res: Response) => {
  const excKey = error.message
  if (exceptions.has(excKey)) {
    const excRes: ExceptionResponseType = exceptions.get(excKey)
    return res.status(excRes.statusCode).json(excRes.body)
  }
  return res.status(500).json({
    type: 'errors/server-error',
    detail: 'Internal server error. If issue persists, reach out to cookbooks',
  })
}

export const MISSING_REQUIRED_PARAMS = 'errors/missing-required-params'
export const MISSING_REQUIRED_PARAMS_RES: ExceptionResponseType = {
  statusCode: 400,
  body: {
    type: 'errors/missing-required-params',
    detail: 'Client request missing required parameters',
  },
}

export const INCOMPLETE_REQUEST_BODY = 'errors/incomplete-request-body'
export const INCOMPLETE_REQUEST_BODY_RES: ExceptionResponseType = {
  statusCode: 400,
  body: {
    type: 'errors/incomplete-request-body',
    detail: 'Client request body missing required fields',
  },
}

export const INVALID_URL = 'errors/invalid-url'
export const INVALID_URL_RES: ExceptionResponseType = {
  statusCode: 400,
  body: {
    type: 'errors/invalid-url',
    detail: 'Client request params include invalid url',
  },
}

export const RECIPE_NOT_FOUND = 'errors/recipe-not-found'
export const RECIPE_NOT_FOUND_RES: ExceptionResponseType = {
  statusCode: 500,
  body: {
    type: 'errors/recipe-not-found',
    detail: 'Recipe could not be parsed from provided url',
  },
}

const exceptions = new Map()
exceptions.set(MISSING_REQUIRED_PARAMS, MISSING_REQUIRED_PARAMS_RES)
exceptions.set(INCOMPLETE_REQUEST_BODY, INCOMPLETE_REQUEST_BODY_RES)
exceptions.set(INVALID_URL, INVALID_URL_RES)
exceptions.set(RECIPE_NOT_FOUND, RECIPE_NOT_FOUND_RES)
