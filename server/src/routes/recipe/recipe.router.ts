import express from 'express'
import { httpGetCookbookRecipes, httpGetRecipe, httpGetUserRecipes } from './recipe.controller'

export const recipeRouter = express.Router()

recipeRouter.get('/', httpGetRecipe)
recipeRouter.get('/cookbook', httpGetCookbookRecipes)
recipeRouter.get('/user', httpGetUserRecipes)
