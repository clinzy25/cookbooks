import { Request, Response } from 'express'
import { getCookbookRecipes, getRecipe } from '../../model/recipe.model'

export async function httpGetCookbookRecipes(req: Request, res: Response) {
  const cookbook = req.query.cookbook?.toString()

  if (!cookbook) {
    return res.status(404).json('Missing required params')
  }
  const recipes = await getCookbookRecipes(cookbook)
  return res.status(200).json(recipes)
}

export async function httpGetRecipe(req: Request, res: Response) {
  const recipe_guid = req.query.recipe_guid?.toString()

  if (!recipe_guid) {
    return res.status(404).json('Missing required params')
  }
  const recipe = await getRecipe(recipe_guid)
  return res.status(200).json(recipe)
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function httpGetUserRecipes() {}
