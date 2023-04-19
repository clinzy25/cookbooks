import { Request, Response, NextFunction } from 'express'
import { MISSING_REQUIRED_PARAMS } from '../../utils/utils.errors'
import { dbGetCookbookMembers } from '../../model/user.model'
import { transformMembers } from '../../model/transformers'

export async function httpGetCookbookMembers(req: Request, res: Response, next: NextFunction) {
  const cookbook_guid = req.query.cookbook_guid?.toString()
  try {
    if (!cookbook_guid) throw new Error(MISSING_REQUIRED_PARAMS)
    const result = await dbGetCookbookMembers(cookbook_guid)
    const transformedResult = transformMembers(result)
    return res.status(200).json(transformedResult)
  } catch (e) {
    next(e)
  }
}
