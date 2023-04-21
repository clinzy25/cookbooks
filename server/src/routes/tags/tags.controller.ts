import { NextFunction, Request, Response } from 'express'
import { dbGetTagsByCookbook, dbGetTagsByUser } from '../../model/tags.model'
import { MISSING_REQUIRED_PARAMS } from '../../utils/utils.errors'
import { transformTags } from '../../model/transformers'

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
    const transformedTags = transformTags(tags)
    return res.status(200).json(transformedTags)
  } catch (e) {
    next(e)
  }
}
