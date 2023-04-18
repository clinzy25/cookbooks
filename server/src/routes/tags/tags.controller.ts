import { NextFunction, Request, Response } from 'express'
import { dbGetTags } from '../../model/tags.model'
import { MISSING_REQUIRED_PARAMS } from '../../utils/utils.errors'
import { transformTags } from '../../model/transformers'

export async function httpGetTags(req: Request, res: Response, next: NextFunction) {
  const cookbook_guid = req.query.cookbook_guid?.toString()
  try {
    if (!cookbook_guid) throw new Error(MISSING_REQUIRED_PARAMS)
    const tags = await dbGetTags(cookbook_guid)
    const transformedTags = transformTags(tags)
    return res.status(200).json(transformedTags)
  } catch (e) {
    next(e)
  }
}
