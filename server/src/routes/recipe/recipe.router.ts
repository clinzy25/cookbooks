import express from 'express'
import { httpGetCookbookRecipes, httpGetRecipe, httpParseRecipe } from './recipe.controller'

export const recipeRouter = express.Router()

recipeRouter.get('/', httpGetRecipe)
recipeRouter.get('/cookbook', httpGetCookbookRecipes)
recipeRouter.post('/parse', httpParseRecipe)
