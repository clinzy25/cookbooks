import { Request, Response, NextFunction } from 'express'
import {
  FAILED_TO_CREATE_RESOURCE,
  INCOMPLETE_REQUEST_BODY,
  MISSING_REQUIRED_PARAMS,
} from '../../utils/utils.errors'
import { dbGetCookbookMembers, dbSendInvite } from '../../model/user.model'
import { transformMembers } from '../../model/transformers'
import { ISendInviteRequestBody } from '../../types/@types.users'
import {
  REQUEST_SUCCEEDED,
  RESOURCE_CREATED_SUCCESSFULLY,
  handleSuccess,
} from '../../utils/utils.success'

export async function httpGetCookbookMembers(req: Request, res: Response, next: NextFunction) {
  const cookbook_guid = req.query.cookbook_guid?.toString()
  try {
    if (!cookbook_guid) throw new Error(MISSING_REQUIRED_PARAMS)
    const result = await dbGetCookbookMembers(cookbook_guid)
    const transformedResult = transformMembers(result)
    return handleSuccess(REQUEST_SUCCEEDED, res, transformedResult)
  } catch (e) {
    next(e)
  }
}

export async function httpSendInvite(
  req: Request<ISendInviteRequestBody[]>,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.body) throw new Error(INCOMPLETE_REQUEST_BODY)
    const { invites } = req.body
    const response: string[] = []

    for (let i = 0; i < invites.length; i++) {
      const { email, cookbook_guid } = invites[i]
      if (!email || !cookbook_guid) throw new Error(INCOMPLETE_REQUEST_BODY)
      const result = await dbSendInvite(email, cookbook_guid)
      const guid = result.rows[0].guid
      if (!guid) {
        throw new Error(FAILED_TO_CREATE_RESOURCE)
      }
      response.push(guid)
    }
    return handleSuccess(RESOURCE_CREATED_SUCCESSFULLY, res, response)
  } catch (e) {
    next(e)
  }
}
