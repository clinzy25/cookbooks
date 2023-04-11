import { Request, Response } from 'express'
import { getCookbook } from '../../model/cookbooks.model'

export async function httpGetCookbook(req: Request, res: Response) {
  const id = Number(req.query.id)
  const cookbook = await getCookbook(id)

  return res.status(200).json(cookbook)
}
