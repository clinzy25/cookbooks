/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextFunction, Request, Response } from 'express'
import {
  dbAddRecipe,
  dbDeleteRecipe,
  dbGetCookbookRecipes,
  dbGetRecipe,
} from '../../model/recipe.model'
import {
  FAILED_TO_CREATE_RESOURCE,
  INCOMPLETE_REQUEST_BODY,
  MISSING_REQUIRED_PARAMS,
  RECIPE_NOT_FOUND,
  RESOURCE_NOT_FOUND,
} from '../../utils/utils.errors'
import { IRecipe } from '../../types/@types.recipes'
import { getRecipeImage } from './recipe.utils'
import { getPlaiceholder } from 'plaiceholder'
import recipeDataScraper from '../../recipe-parser/main'

export async function httpGetCookbookRecipes(req: Request, res: Response, next: NextFunction) {
  const cookbook = req.query.cookbook?.toString()
  const limit = Number(req.query.limit)
  const offset = Number(req.query.offset)
  try {
    if (!cookbook) throw new Error(MISSING_REQUIRED_PARAMS)
    const result = await dbGetCookbookRecipes(cookbook, limit, offset)
    return res.status(200).json(result)
  } catch (e) {
    next(e)
  }
}

export async function httpGetRecipe(req: Request, res: Response, next: NextFunction) {
  const recipe_guid = req.query.recipe_guid?.toString()
  try {
    if (!recipe_guid) throw new Error(MISSING_REQUIRED_PARAMS)
    const recipe = await dbGetRecipe(recipe_guid)
    return res.status(200).json(recipe)
  } catch (e) {
    next(e)
  }
}

export async function httpParseRecipe(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.body) throw new Error(INCOMPLETE_REQUEST_BODY)
    const { recipes } = req.body
    const response: IRecipe[] = []
    for (let i = 0; i < recipes.length; i++) {
      const { url, cookbook_guid, source_type, is_private } = recipes[i]
      if (!url || !cookbook_guid) throw new Error(INCOMPLETE_REQUEST_BODY)

      const parsedRecipe = await recipeDataScraper(url)
      if (!parsedRecipe) {
        if (recipes.length === 1) {
          throw new Error(RECIPE_NOT_FOUND)
        }
        continue
      }
      const imageUrl = await getRecipeImage(parsedRecipe)
      const { base64 } = await getPlaiceholder(imageUrl)
      const fullRecipe = {
        ...parsedRecipe,
        image: imageUrl,
        base64Image: base64,
        cookbook_guid,
        source_type,
        is_private,
      }
      // @ts-ignore -- will disable when recipe-parser is typed
      const result = await dbAddRecipe(fullRecipe)
      // @ts-ignore -- will disable when recipe-parser is typed
      response.push(fullRecipe)
      if (!result.rows?.[0]?.recipe_id && !result.fields.length) {
        throw new Error(FAILED_TO_CREATE_RESOURCE)
      }
    }
    return res.status(200).json(response)
  } catch (e) {
    next(e)
  }
}

export async function httpDeleteRecipe(req: Request, res: Response, next: NextFunction) {
  const recipe_guid = req.query.recipe_guid?.toString()
  try {
    if (!recipe_guid) throw new Error(MISSING_REQUIRED_PARAMS)
    const result = await dbDeleteRecipe(recipe_guid)
    if (!result.length) throw new Error(RESOURCE_NOT_FOUND)
    return res.status(200).json(result)
  } catch (e) {
    next(e)
  }
}
