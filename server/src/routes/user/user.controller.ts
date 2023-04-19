import { Request, Response, NextFunction } from 'express'
import {
  FAILED_TO_CREATE_RESOURCE,
  INCOMPLETE_REQUEST_BODY,
  MISSING_REQUIRED_PARAMS,
} from '../../utils/utils.errors'
import { dbGetCookbookMembers, dbSendInvite } from '../../model/user.model'
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

export async function httpSendInvite(req: Request, res: Response, next: NextFunction) {
  const { email, cookbook_guid } = req.body
  try {
    if (!email || !cookbook_guid) throw new Error(INCOMPLETE_REQUEST_BODY)
    const result = await dbSendInvite(email, cookbook_guid)
    const guid = result.rows[0].guid
    if (!guid) {
      throw new Error(FAILED_TO_CREATE_RESOURCE)
    }
    return res.status(201).json({ guid })
  } catch (e) {
    next(e)
  }
}
