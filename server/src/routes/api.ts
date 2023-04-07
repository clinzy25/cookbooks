import express from 'express'
import { cookbookRouter } from './cookbook/cookbook.router'

export const api = express.Router()

api.use('/cookbooks', cookbookRouter)
