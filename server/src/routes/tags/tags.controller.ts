import { NextFunction, Request, Response } from 'express'
import {
  dbDeleteTags,
  dbGetTagsByCookbook,
  dbGetTagsByUser,
  dbUpdateTags,
} from '../../model/tags.model'
import {
  INCOMPLETE_REQUEST_BODY,
  MISSING_REQUIRED_PARAMS,
  RESOURCE_NOT_FOUND,
} from '../../utils/utils.errors'

export async function httpGetTags(req: Request, res: Response, next: NextFunction) {
  const cookbook_guid = req.query.cookbook_guid?.toString()
  const user_guid = req.query.user_guid?.toString()
  const limit = Number(req.query.limit)
  const offset = Number(req.query.offset)
  try {
    if (!cookbook_guid && !user_guid) throw new Error(MISSING_REQUIRED_PARAMS)
    let tags = []
    if (user_guid) {
      const result = await dbGetTagsByUser(user_guid, limit, offset)
      tags = result.rows
    } else if (cookbook_guid) {
      const result = await dbGetTagsByCookbook(cookbook_guid, limit, offset)
      tags = result.rows
    }
    return res.status(200).json(tags)
  } catch (e) {
    next(e)
  }
}

export async function httpDeleteTags(req: Request, res: Response, next: NextFunction) {
  const { tags, cookbook_guid } = req.body
  try {
    if (!tags.length) throw new Error(INCOMPLETE_REQUEST_BODY)
    const result = await dbDeleteTags(tags, cookbook_guid)
    if (!result) throw new Error(RESOURCE_NOT_FOUND)
    return res.status(200).json(result.rows)
  } catch (e) {
    next(e)
  }
}

export async function httpUpdateTag(req: Request, res: Response, next: NextFunction) {
  const { tags, cookbook_guid } = req.body
  try {
    if (!tags.length || !cookbook_guid) throw new Error(INCOMPLETE_REQUEST_BODY)
    const result = await dbUpdateTags(tags, cookbook_guid)
    if (!result) throw new Error(RESOURCE_NOT_FOUND)
    const response = result.map(r => r.rows[0])
    return res.status(200).json(response)
  } catch (e) {
    next(e)
  }
}
