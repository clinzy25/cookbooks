import { Request, Response } from 'express'
import { getRecipes } from '../../model/recipe.model'

export async function httpGetRecipes(req: Request, res: Response) {
  const cookbook = req.query.cookbook?.toString()

  if (cookbook) {
    const recipes = await getRecipes(cookbook)
    return res.status(200).json(recipes)
  }
  return res.status(404).json('Missing required params')
}
