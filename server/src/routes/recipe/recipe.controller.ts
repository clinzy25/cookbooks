import { Request, Response } from 'express'
import { getCookbookRecipes, getRecipe } from '../../model/recipe.model'

export async function httpGetCookbookRecipes(req: Request, res: Response) {
  const cookbook = req.query.cookbook?.toString()

  if (cookbook) {
    const recipes = await getCookbookRecipes(cookbook)
    return res.status(200).json(recipes)
  }
  return res.status(404).json('Missing required params')
}

export async function httpGetRecipe(req: Request, res: Response) {
  const recipe_guid = req.query.recipe_guid?.toString()

  if (recipe_guid) {
    const recipe = await getRecipe(recipe_guid)
    return res.status(200).json(recipe)
  }
  return res.status(404).json('Missing required params')
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function httpGetUserRecipes() {}
