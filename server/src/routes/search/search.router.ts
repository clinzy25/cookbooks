import express from 'express'
import { httpSearchRecipes, httpSearchRecipesByTag } from './search.controller'

export const searchRouter = express.Router()

searchRouter.get('/recipes', httpSearchRecipes)
searchRouter.get('/recipes/tag', httpSearchRecipesByTag)