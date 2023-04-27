import { Response } from 'express'
import { IExceptionResponse } from '../types/@types.utils'

export const errorHandler = (error: Error, res: Response) => {
  console.error(error)
  const key = error.message
  if (exceptions.has(key)) {
    const { statusCode, body } = exceptions.get(key)
    return res.status(statusCode).json(body)
  }
  return res.status(500).json({
    type: 'errors/internal-server-error',
    detail: 'Internal server error. If issue persists, reach out to cookbooks',
  })
}

export const MISSING_REQUIRED_PARAMS = 'errors/missing-required-params'
export const MISSING_REQUIRED_PARAMS_RES: IExceptionResponse = {
  statusCode: 400,
  body: {
    type: 'errors/missing-required-params',
    detail: 'Client request missing required parameters',
  },
}

export const INCOMPLETE_REQUEST_BODY = 'errors/incomplete-request-body'
export const INCOMPLETE_REQUEST_BODY_RES: IExceptionResponse = {
  statusCode: 400,
  body: {
    type: 'errors/incomplete-request-body',
    detail: 'Client request body missing required fields',
  },
}

export const INVALID_URL = 'errors/invalid-url'
export const INVALID_URL_RES: IExceptionResponse = {
  statusCode: 400,
  body: {
    type: 'errors/invalid-url',
    detail: 'Client request params include invalid url',
  },
}

export const RECIPE_NOT_FOUND = 'errors/recipe-not-found'
export const RECIPE_NOT_FOUND_RES: IExceptionResponse = {
  statusCode: 500,
  body: {
    type: 'errors/recipe-not-found',
    detail: 'Recipe could not be parsed from provided url',
  },
}

export const FAILED_TO_CREATE_RESOURCE = 'errors/failed-to-create-resource'
export const FAILED_TO_CREATE_RESOURCE_RES: IExceptionResponse = {
  statusCode: 500,
  body: {
    type: 'errors/failed-to-create-resource',
    detail: 'Resource could not be created',
  },
}

export const S3_UPLOAD_FAILED = 'errors/s3-upload-failed'
export const S3_UPLOAD_FAILED_RES: IExceptionResponse = {
  statusCode: 500,
  body: {
    type: 'errors/s3-upload-failed',
    detail: 'Could not upload to S3 bucket',
  },
}

export const FAILED_TO_FETCH_IMAGE = 'errors/failed-to-fetch-image'
export const FAILED_TO_FETCH_IMAGE_RES: IExceptionResponse = {
  statusCode: 404,
  body: {
    type: 'errors/failed-to-fetch-image',
    detail: 'Failed to fetch image from recipe source',
  },
}

export const RESOURCE_NOT_FOUND = 'errors/resource-not-found'
export const RESOURCE_NOT_FOUND_RES: IExceptionResponse = {
  statusCode: 404,
  body: {
    type: 'errors/resource-not-found',
    detail: 'Resource could not be updated',
  },
}

const exceptions = new Map()
exceptions.set(MISSING_REQUIRED_PARAMS, MISSING_REQUIRED_PARAMS_RES)
exceptions.set(INCOMPLETE_REQUEST_BODY, INCOMPLETE_REQUEST_BODY_RES)
exceptions.set(INVALID_URL, INVALID_URL_RES)
exceptions.set(RECIPE_NOT_FOUND, RECIPE_NOT_FOUND_RES)
exceptions.set(FAILED_TO_CREATE_RESOURCE, FAILED_TO_CREATE_RESOURCE_RES)
exceptions.set(RESOURCE_NOT_FOUND, RESOURCE_NOT_FOUND_RES)
