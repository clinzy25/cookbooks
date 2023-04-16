import { Request, Response } from 'express'
import { createCookbook, getCookbooks } from '../../model/cookbook.model'

export async function httpGetCookbooks(req: Request, res: Response) {
  const user_guid = req.query.user_guid?.toString()

  if (!user_guid) {
    return res.status(400).json('Missing required params')
  }
  const cookbooks = await getCookbooks(user_guid)
  return res.status(200).json(cookbooks)
}

export async function httpCreateCookbook(req: Request, res: Response) {
  const cookbook = req.body.newCookbook

  if (!cookbook) {
    return res.status(400).json('Missing body of the request')
  }
  const result = await createCookbook(cookbook)
  if (!result?.rows?.[0]?.cookbook_name === cookbook.cookbook_name) {
    return res.status(500).json('Cookbook creation failed')
  }
  return res.status(201).json('Cookbook creation successful')
}
