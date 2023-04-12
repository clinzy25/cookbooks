import express from 'express'
import { httpGetCookbooks } from './cookbook.controller'

export const cookbookRouter = express.Router()

cookbookRouter.get('/', httpGetCookbooks)
