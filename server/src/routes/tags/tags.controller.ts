import { NextFunction, Request, Response } from 'express'
import { dbDeleteTags, dbGetTagsByCookbook, dbGetTagsByUser, dbUpdateTag } from '../../model/tags.model'
import {
  INCOMPLETE_REQUEST_BODY,
  MISSING_REQUIRED_PARAMS,
  RESOURCE_NOT_FOUND,
} from '../../utils/utils.errors'
import {
  REQUEST_SUCCEEDED,
  RESOURCE_DELETED_SUCCESSFULLY,
  RESOURCE_UPDATED_SUCCESSFULLY,
  handleSuccess,
} from '../../utils/utils.success'

export async function httpGetTags(req: Request, res: Response, next: NextFunction) {
  const cookbook_guid = req.query.cookbook_guid?.toString()
  const user_guid = req.query.user_guid?.toString()
  try {
    if (!cookbook_guid && !user_guid) throw new Error(MISSING_REQUIRED_PARAMS)
    let tags = []
    if (user_guid) {
      const result = await dbGetTagsByUser(user_guid)
      tags = result.rows
    } else if (cookbook_guid) {
      const result = await dbGetTagsByCookbook(cookbook_guid)
      tags = result.rows
    }
    return handleSuccess(REQUEST_SUCCEEDED, res, tags)
  } catch (e) {
    next(e)
  }
}

export async function httpDeleteTags(req: Request, res: Response, next: NextFunction) {
  const { tags } = req.body
  try {
    if (!tags.length) throw new Error(INCOMPLETE_REQUEST_BODY)
    const result = await dbDeleteTags(tags)
    if (!result) throw new Error(RESOURCE_NOT_FOUND)
    return handleSuccess(RESOURCE_DELETED_SUCCESSFULLY, res, result[0])
  } catch (e) {
    next(e)
  }
}

export async function httpUpdateTag(req: Request, res: Response, next: NextFunction) {
  const { tag } = req.body
  try {
    if (!tag) throw new Error(INCOMPLETE_REQUEST_BODY)
    const result = await dbUpdateTag(tag)
    if (!result) throw new Error(RESOURCE_NOT_FOUND)
    return handleSuccess(RESOURCE_UPDATED_SUCCESSFULLY, res, result[0])
  } catch (e) {
    next(e)
  }
}
