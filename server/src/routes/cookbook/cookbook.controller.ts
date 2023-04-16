import { NextFunction, Request, Response } from 'express'
import { createCookbook, getCookbooks } from '../../model/cookbook.model'
import { FAILED_TO_CREATE_RESOURCE, INCOMPLETE_REQUEST_BODY, MISSING_REQUIRED_PARAMS } from '../../utils/utils.errors'

export async function httpGetCookbooks(req: Request, res: Response, next: NextFunction) {
  const user_guid = req.query.user_guid?.toString()
  try {
    if (!user_guid) {
      throw new Error(MISSING_REQUIRED_PARAMS)
    }
    const cookbooks = await getCookbooks(user_guid)
    return res.status(200).json(cookbooks)
  } catch (e) {
    next(e)
  }
}

export async function httpCreateCookbook(req: Request, res: Response, next: NextFunction) {
  const cookbook = req.body.newCookbook

  try {
    if (!cookbook) {
      throw new Error(INCOMPLETE_REQUEST_BODY)
    }
    const result = await createCookbook(cookbook)
    if (!result?.rows?.[0]?.cookbook_name === cookbook.cookbook_name) {
      throw new Error(FAILED_TO_CREATE_RESOURCE)
    }
    return res.status(201).json('Cookbook creation successful')
  } catch (e) {
    next(e)
  }
}
