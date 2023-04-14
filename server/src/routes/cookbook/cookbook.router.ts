import express from 'express'
import { httpCreateCookbook, httpGetCookbooks } from './cookbook.controller'

export const cookbookRouter = express.Router()

cookbookRouter.get('/', httpGetCookbooks)
cookbookRouter.post('/', httpCreateCookbook)
