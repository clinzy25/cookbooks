import { Request, Response, NextFunction } from 'express'
import {
  FAILED_TO_CREATE_RESOURCE,
  INCOMPLETE_REQUEST_BODY,
  MISSING_REQUIRED_PARAMS,
} from '../../utils/utils.errors'
import {
  dbGetCookbookMembers,
  dbSendInvite,
  dbCreateUserIfNotExists,
} from '../../model/user.model'
import { transformMembers } from '../../model/transformers'

export async function httpCreateUser(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.body) throw new Error(INCOMPLETE_REQUEST_BODY)
    const params = req.body
    const result = await dbCreateUserIfNotExists(params)
    if (result.rowCount > 0) {
      return res.status(201).json('Welcome to cookbooks!')
    }
    return res.status(200).json('Welcome back')
  } catch (e) {
    next(e)
  }
}

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
  try {
    if (!req.body) throw new Error(INCOMPLETE_REQUEST_BODY)
    const { invites } = req.body
    const response: string[] = []

    for (let i = 0; i < invites.length; i++) {
      const { email, cookbook_guid } = invites[i]
      if (!email || !cookbook_guid) throw new Error(INCOMPLETE_REQUEST_BODY)
      const params = { email, cookbook_guid }
      const result = await dbSendInvite(params)
      const guid = result.rows[0].guid
      if (!guid) {
        throw new Error(FAILED_TO_CREATE_RESOURCE)
      }
      response.push(guid)
    }
    return res.status(201).json(response)
  } catch (e) {
    next(e)
  }
}
