import express from 'express'
import { cookbookRouter } from './cookbook/cookbook.router'
import { recipeRouter } from './recipe/recipe.router'
import { tagsRouter } from './tags/tags.router'

export const api = express.Router()

api.use('/cookbooks', cookbookRouter)
api.use('/recipes', recipeRouter)
api.use('/tags', tagsRouter)
