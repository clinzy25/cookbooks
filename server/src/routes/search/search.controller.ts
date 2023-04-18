import { NextFunction, Request, Response } from 'express'
import { dbSearchRecipesByTag } from '../../model/search.model'
import { MISSING_REQUIRED_PARAMS } from '../../utils/utils.errors'

export async function httpSearchRecipesByTag(req: Request, res: Response, next: NextFunction) {
  const tagName = req.query.tag_name?.toString()
  const cookbookGuid = req.query.cookbook_guid?.toString()
  try {
    if (!tagName) throw new Error(MISSING_REQUIRED_PARAMS)
    const results = await dbSearchRecipesByTag(tagName, cookbookGuid)
    return res.status(200).json(results.rows)
  } catch (e) {
    console.error(e)
  }
}

export async function httpSearchAllRecipes(req: Request, res: Response, next: NextFunction) {
  return
}
