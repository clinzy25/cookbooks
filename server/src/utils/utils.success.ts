import { Response } from 'express'
import { ISuccessResponseType } from '../types/@types.utils'

export const handleSuccess = (type: string, res: Response, data?: unknown) => {
  if (successTypes.has(type)) {
    const { statusCode, message } = successTypes.get(type)
    return res.status(statusCode).json({ message, data })
  }
  return res.status(200).json({
    type: 'success/request-succeeded',
    detail: 'Your request was processed successfully',
    data,
  })
}

export const REQUEST_SUCCEEDED = 'success/request-succeeded'
export const REQUEST_SUCCEEDED_RES: ISuccessResponseType = {
  statusCode: 200,
  message: 'Your request was processed successfully',
}

export const RESOURCE_CREATED_SUCCESSFULLY = 'success/create-success'
export const RESOURCE_CREATED_SUCCESSFULLY_RES: ISuccessResponseType = {
  statusCode: 201,
  message: 'Resource created successfully',
}

export const RESOURCE_UPDATED_SUCCESSFULLY = 'success/update-success'
export const RESOURCE_UPDATED_SUCCESSFULLY_RES: ISuccessResponseType = {
  statusCode: 204,
  message: 'Resource updated successfully',
}

export const RESOURCE_DELETED_SUCCESSFULLY = 'success/delete-success'
export const RESOURCE_DELETED_SUCCESSFULLY_RES: ISuccessResponseType = {
  statusCode: 200,
  message: 'Resource deleted successfully',
}

const successTypes = new Map()
successTypes.set(REQUEST_SUCCEEDED, REQUEST_SUCCEEDED_RES)
successTypes.set(RESOURCE_CREATED_SUCCESSFULLY, RESOURCE_CREATED_SUCCESSFULLY_RES)
successTypes.set(RESOURCE_UPDATED_SUCCESSFULLY, RESOURCE_UPDATED_SUCCESSFULLY_RES)
successTypes.set(RESOURCE_DELETED_SUCCESSFULLY, RESOURCE_DELETED_SUCCESSFULLY_RES)
