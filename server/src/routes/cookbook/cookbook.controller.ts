import { NextFunction, Request, Response } from 'express'
import {
  dbCreateCookbook,
  dbDeleteCookbook,
  dbGetCookbooks,
  dbUpdateCookbook,
} from '../../model/cookbook.model'
import {
  FAILED_TO_CREATE_RESOURCE,
  INCOMPLETE_REQUEST_BODY,
  MISSING_REQUIRED_PARAMS,
  RESOURCE_NOT_FOUND,
} from '../../utils/utils.errors'
import {
  REQUEST_SUCCEEDED,
  RESOURCE_CREATED_SUCCESSFULLY,
  RESOURCE_DELETED_SUCCESSFULLY,
  RESOURCE_UPDATED_SUCCESSFULLY,
  handleSuccess,
} from '../../utils/utils.success'

export async function httpGetCookbooks(req: Request, res: Response, next: NextFunction) {
  const user_guid = req.query.user_guid?.toString()
  try {
    if (!user_guid) throw new Error(MISSING_REQUIRED_PARAMS)
    const result = await dbGetCookbooks(user_guid)
    return handleSuccess(REQUEST_SUCCEEDED, res, result.rows)
  } catch (e) {
    next(e)
  }
}

export async function httpCreateCookbook(req: Request, res: Response, next: NextFunction) {
  const { cookbook } = req.body
  try {
    if (!cookbook) throw new Error(INCOMPLETE_REQUEST_BODY)
    const result = await dbCreateCookbook(cookbook)
    if (!result) throw new Error(FAILED_TO_CREATE_RESOURCE)
    return handleSuccess(RESOURCE_CREATED_SUCCESSFULLY, res, result.rows[0].cookbook_name)
  } catch (e) {
    next(e)
  }
}

export async function httpUpdateCookbook(req: Request, res: Response, next: NextFunction) {
  const { cookbook_guid, cookbook_name } = req.body
  try {
    if (!cookbook_guid) throw new Error(INCOMPLETE_REQUEST_BODY)
    const result = await dbUpdateCookbook(cookbook_guid, cookbook_name)
    if (!result) throw new Error(RESOURCE_NOT_FOUND)
    return handleSuccess(RESOURCE_UPDATED_SUCCESSFULLY, res, result[0])
  } catch (e) {
    next(e)
  }
}

export async function httpDeleteCookbook(req: Request, res: Response, next: NextFunction) {
  const cookbook_guid = req.query.cookbook_guid?.toString()
  try {
    if (!cookbook_guid) throw new Error(MISSING_REQUIRED_PARAMS)
    const result = await dbDeleteCookbook(cookbook_guid)
    if (!result) throw new Error(RESOURCE_NOT_FOUND)
    return handleSuccess(RESOURCE_DELETED_SUCCESSFULLY, res, result[0])
  } catch (e) {
    next(e)
  }
}
