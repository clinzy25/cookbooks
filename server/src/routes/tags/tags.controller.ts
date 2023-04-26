import { NextFunction, Request, Response } from 'express'
import { dbGetTagsByCookbook, dbGetTagsByUser } from '../../model/tags.model'
import { MISSING_REQUIRED_PARAMS } from '../../utils/utils.errors'
import { REQUEST_SUCCEEDED, handleSuccess } from '../../utils/utils.success'

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
