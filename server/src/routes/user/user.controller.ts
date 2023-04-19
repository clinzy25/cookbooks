import { Request, Response, NextFunction } from 'express'
import { FAILED_TO_CREATE_RESOURCE, INCOMPLETE_REQUEST_BODY } from '../../utils/utils.errors'
import { dbCreateInvite } from '../../model/user.model'

export async function httpCreateIvite(req: Request, res: Response, next: NextFunction) {
  try {
    if (!Object.values(req.body).every(_ => _)) {
      throw new Error(INCOMPLETE_REQUEST_BODY)
    }
    const result = await dbCreateInvite(req.body)
    const guid = result?.rows[0]['?column?']
    if (!guid) {
      throw new Error(FAILED_TO_CREATE_RESOURCE)
    }
    return res.status(201).json({ guid })
  } catch (e) {
    next(e)
  }
}
