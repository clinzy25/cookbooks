import { Request, Response } from 'express'
import { createCookbook, getCookbooks } from '../../model/cookbook.model'

export async function httpGetCookbooks(req: Request, res: Response) {
  const user_guid = req.query.user_guid?.toString()

  if (user_guid) {
    const cookbooks = await getCookbooks(user_guid)
    return res.status(200).json(cookbooks)
  }
  return res.status(404).json('Missing required params')
}

export async function httpCreateCookbook(req: Request, res: Response) {
  const cookbook = req.body.newCookbook

  if (cookbook) {
    const result = await createCookbook(cookbook)
    if (result.rows[0].cookbook_name === cookbook.cookbook_name) {
      return res.status(201).json('Cookbook creation successful')
    }
    return res.status(500).json('Cookbook creation failed')
  }
  return res.status(404).json('Missing body of the request')
}
