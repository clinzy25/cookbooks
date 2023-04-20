import { NextFunction, Request, Response } from 'express'
import { dbAddRecipe, dbGetCookbookRecipes, dbGetRecipe } from '../../model/recipe.model'
import recipeDataScraper from 'recipe-data-scraper'
import fetch from 'node-fetch'
import {
  FAILED_TO_CREATE_RESOURCE,
  INCOMPLETE_REQUEST_BODY,
  INVALID_URL,
  MISSING_REQUIRED_PARAMS,
  RECIPE_NOT_FOUND,
} from '../../utils/utils.errors'
import { IParseRecipeRequestBody, IRecipe } from '../../types/@types.recipes'
import { uploadToS3 } from './recipe.utils'

export async function httpGetCookbookRecipes(req: Request, res: Response, next: NextFunction) {
  const cookbook = req.query.cookbook?.toString()
  try {
    if (!cookbook) throw new Error(MISSING_REQUIRED_PARAMS)
    const recipes = await dbGetCookbookRecipes(cookbook)
    return res.status(200).json(recipes)
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

export async function httpParseRecipe(
  req: Request<IParseRecipeRequestBody[]>,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.body) throw new Error(INCOMPLETE_REQUEST_BODY)
    const { recipes } = req.body
    const response: IRecipe[] = []
    for (let i = 0; i < recipes.length; i++) {
      const { url, cookbook_guid, source_type, is_private } = recipes[i]
      if (!url || !cookbook_guid) throw new Error(INCOMPLETE_REQUEST_BODY)
      await fetch(url).catch(err => {
        if (err.code === 'ERR_INVALID_URL') throw new Error(INVALID_URL)
      })
      const parsedRecipe = await recipeDataScraper(url)
      if (!parsedRecipe) throw new Error(RECIPE_NOT_FOUND)
      const imageUrl = await uploadToS3(parsedRecipe.image)
      const fullRecipe = {
        ...parsedRecipe,
        image: imageUrl,
        cookbook_guid,
        source_type,
        is_private,
      }
      const result = await dbAddRecipe(fullRecipe)
      response.push(fullRecipe)
      if (!result?.rows?.[0]?.recipe_id) {
        throw new Error(FAILED_TO_CREATE_RESOURCE)
      }
    }
    return res.status(201).json(response)
  } catch (e) {
    next(e)
  }
}
