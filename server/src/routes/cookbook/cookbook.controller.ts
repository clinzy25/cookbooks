import { NextFunction, Request, Response } from 'express'
import {
  dbCreateCookbook,
  dbDeleteCookbook,
  dbGetCookbooks,
  dbUpdateCookbook,
} from '../../model/cookbook.model'
import {
  FAILED_TO_CREATE_RESOURCE,
  INCOMPLETE_REQUEST_BODY,
  MISSING_REQUIRED_PARAMS,
  RESOURCE_NOT_FOUND,
} from '../../utils/utils.errors'

export async function httpGetCookbooks(req: Request, res: Response, next: NextFunction) {
  const user_guid = req.query.user_guid?.toString()
  try {
    if (!user_guid) throw new Error(MISSING_REQUIRED_PARAMS)
    const { rows: cookbooks } = await dbGetCookbooks(user_guid)
    return res.status(200).json(cookbooks)
  } catch (e) {
    next(e)
  }
}

export async function httpCreateCookbook(req: Request, res: Response, next: NextFunction) {
  const { cookbook } = req.body
  try {
    if (!cookbook) throw new Error(INCOMPLETE_REQUEST_BODY)
    const result = await dbCreateCookbook(cookbook)
    const guid = result?.rows?.[0]?.guid
    if (!guid) throw new Error(FAILED_TO_CREATE_RESOURCE)
    return res.status(201).json({ message: 'Cookbook creation successful', guid })
  } catch (e) {
    next(e)
  }
}

export async function httpUpdateCookbook(req: Request, res: Response, next: NextFunction) {
  const { cookbook_guid, cookbook_name } = req.body
  try {
    if (!cookbook_guid) throw new Error(INCOMPLETE_REQUEST_BODY)
    const result = await dbUpdateCookbook(cookbook_guid, cookbook_name)
    if (!result) {
      throw new Error(RESOURCE_NOT_FOUND)
    }
    return res.status(200).json(result[0])
  } catch (e) {
    console.log(e.message)
    next(e)
  }
}

export async function httpDeleteCookbook(req: Request, res: Response, next: NextFunction) {
  const cookbook_guid = req.query.cookbook_guid?.toString()
  try {
    if (!cookbook_guid) throw new Error(MISSING_REQUIRED_PARAMS)
    const result = await dbDeleteCookbook(cookbook_guid)
    if (!result) {
      throw new Error(RESOURCE_NOT_FOUND)
    }
    return res.status(200).json(result[0])
  } catch (e) {
    next(e)
  }
}
