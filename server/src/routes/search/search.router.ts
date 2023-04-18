import express from 'express'
import { httpSearchAllRecipes, httpSearchRecipesByTag } from './search.controller'

export const searchRouter = express.Router()

searchRouter.get('/recipes', httpSearchAllRecipes)
searchRouter.get('/recipes/tag', httpSearchRecipesByTag)