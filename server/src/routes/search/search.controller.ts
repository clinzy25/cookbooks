import { NextFunction, Request, Response } from 'express'
import {
  dbCharSearchRecipes,
  dbTagSearchRecipesByCookbook,
  dbTagSearchRecipes,
} from '../../model/search.model'
import { MISSING_REQUIRED_PARAMS } from '../../utils/utils.errors'
import { splitTagsAndSearchResults } from '../../model/transformers'

export async function httpSearchRecipesByTag(req: Request, res: Response, next: NextFunction) {
  const tag_name = req.query.tag_name?.toString()
  const cookbook_guid = req.query.cookbook_guid?.toString()
  const user_guid = req.query.user_guid?.toString()
  try {
    if (!tag_name || !(cookbook_guid || user_guid)) {
      throw new Error(MISSING_REQUIRED_PARAMS)
    }
    let results = null
    if (cookbook_guid) {
      results = await dbTagSearchRecipesByCookbook(tag_name, cookbook_guid)
    } else {
      results = await dbTagSearchRecipes(tag_name, user_guid)
    }
    return res.status(200).json(results.rows)
  } catch (e) {
    next(e)
  }
}

export async function httpSearchRecipes(req: Request, res: Response, next: NextFunction) {
  const search_val = req.query.search_val?.toString()
  const cookbook_guid = req.query.cookbook_guid?.toString()
  const user_guid = req.query.user_guid?.toString()
  try {
    if (!search_val || !(cookbook_guid || user_guid)) {
      throw new Error(MISSING_REQUIRED_PARAMS)
    }
    const results = await dbCharSearchRecipes(search_val, user_guid, cookbook_guid)
    return res.status(200).json(splitTagsAndSearchResults(results.rows))
  } catch (e) {
    next(e)
  }
}
