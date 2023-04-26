import { NextFunction, Request, Response } from 'express'
import {
  dbCharSearchRecipes,
  dbTagSearchRecipesByCookbook,
  dbTagSearchRecipes,
} from '../../model/search.model'
import { MISSING_REQUIRED_PARAMS } from '../../utils/utils.errors'
import { transformSearchResults } from '../../model/transformers'
import { REQUEST_SUCCEEDED, handleSuccess } from '../../utils/utils.success'

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
    return handleSuccess(REQUEST_SUCCEEDED, res, results.rows)
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
    const transformedResults = transformSearchResults(results.rows)
    return handleSuccess(REQUEST_SUCCEEDED, res, transformedResults)
  } catch (e) {
    next(e)
  }
}
