import { Request, Response } from 'express'
import { getCookbooks } from '../../model/cookbook.model'

export async function httpGetCookbooks(req: Request, res: Response) {
  const user_guid = req.query.user_guid?.toString()

  if (user_guid) {
    const cookbooks = await getCookbooks(user_guid)
    return res.status(200).json(cookbooks)
  }
  return res.status(404).json('Missing required params')
}
