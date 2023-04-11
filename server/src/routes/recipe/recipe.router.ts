import express from 'express'
import { httpGetRecipes } from './recipe.controller'

export const recipeRouter = express.Router()

recipeRouter.get('/', httpGetRecipes)
