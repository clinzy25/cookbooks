import { NextFunction, Request, Response } from 'express'
import {
  dbAddRecipe,
  dbDeleteRecipe,
  dbGetCookbookRecipes,
  dbGetRecipe,
} from '../../model/recipe.model'
import recipeDataScraper from 'recipe-data-scraper'
import fetch from 'node-fetch'
import {
  FAILED_TO_CREATE_RESOURCE,
  INCOMPLETE_REQUEST_BODY,
  INVALID_URL,
  MISSING_REQUIRED_PARAMS,
  RECIPE_NOT_FOUND,
  RESOURCE_NOT_FOUND,
} from '../../utils/utils.errors'
import { IRecipe } from '../../types/@types.recipes'
import { uploadToS3 } from './recipe.utils'

export async function httpGetCookbookRecipes(req: Request, res: Response, next: NextFunction) {
  const cookbook = req.query.cookbook?.toString()
  try {
    if (!cookbook) throw new Error(MISSING_REQUIRED_PARAMS)
    const result = await dbGetCookbookRecipes(cookbook)
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

const getRandomFallback = () => {
  const randomInt = Math.round((Math.random() * (3 - 1) + 1))
  return `${process.env.RECIPE_IMAGES_BUCKET_LINK}/recipe_fallback_${randomInt}.png`
}

const getRecipeImage = async (parsedRecipe: { [key: string]: any }): Promise<string> => {
  const possibleUrls = [parsedRecipe.image, parsedRecipe.image?.contentUrl]
  const url = possibleUrls.find(url => url && typeof url === 'string')
  return url ? await uploadToS3(url) : getRandomFallback()
}

export async function httpParseRecipe(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.body) throw new Error(INCOMPLETE_REQUEST_BODY)
    const { recipes } = req.body
    const response: IRecipe[] = []
    for (let i = 0; i < recipes.length; i++) {
      const { url, cookbook_guid, source_type, is_private } = recipes[i]
      if (!url || !cookbook_guid) throw new Error(INCOMPLETE_REQUEST_BODY)
      
      const isValidUrl = await fetch(url)
      if (isValidUrl.status !== 200) throw new Error(INVALID_URL)
      
      const parsedRecipe = await recipeDataScraper(url)
      if (!parsedRecipe) throw new Error(RECIPE_NOT_FOUND)
      const imageUrl = await getRecipeImage(parsedRecipe)
      
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
