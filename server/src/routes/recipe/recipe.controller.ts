import { NextFunction, Request, Response } from 'express'
import { getCookbookRecipes, getRecipe } from '../../model/recipe.model'
import recipeDataScraper from 'recipe-data-scraper'
import fetch from 'node-fetch'
import {
  INCOMPLETE_REQUEST_BODY,
  INVALID_URL,
  MISSING_REQUIRED_PARAMS,
  RECIPE_NOT_FOUND,
} from '../../utils/utils.errors'

export async function httpGetCookbookRecipes(req: Request, res: Response, next: NextFunction) {
  const cookbook = req.query.cookbook?.toString()
  try {
    if (!cookbook) throw new Error(MISSING_REQUIRED_PARAMS)
    const recipes = await getCookbookRecipes(cookbook)
    return res.status(200).json(recipes)
  } catch (e) {
    next(e)
  }
}

export async function httpGetRecipe(req: Request, res: Response, next: NextFunction) {
  const recipe_guid = req.query.recipe_guid?.toString()
  try {
    if (!recipe_guid) throw new Error(MISSING_REQUIRED_PARAMS)
    const recipe = await getRecipe(recipe_guid)   
    return res.status(200).json(recipe)
  } catch (e) {
    next(e)
  }
}

export async function httpParseRecipe(req: Request, res: Response, next: NextFunction) {
  const url = req.body.url
  try {
    if (!url) throw new Error(INCOMPLETE_REQUEST_BODY)
    await fetch(url).catch(err => {
      if (err.code === 'ERR_INVALID_URL') throw new Error(INVALID_URL)
    })
    const recipe = await recipeDataScraper(url)
    if (!recipe) throw new Error(RECIPE_NOT_FOUND)
    return res.status(200).json(recipe)
  } catch (e) {
    next(e)
  }
}
