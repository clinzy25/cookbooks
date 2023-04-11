import { Request, Response } from 'express'
import { getCookbook } from '../../model/cookbooks.model'

export async function httpGetCookbook(req: Request, res: Response) {
  const user_guid = req.query.user_guid?.toString()
  if (user_guid) {
    const cookbook = await getCookbook(user_guid)
    return res.status(200).json(cookbook)
  }
  return res.status(404).json('Missing required params')
}
