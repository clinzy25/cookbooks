import express from 'express'
import { httpCreateCookbook, httpDeleteCookbook, httpGetCookbooks, httpUpdateCookbook } from './cookbook.controller'

export const cookbookRouter = express.Router()

cookbookRouter.get('/', httpGetCookbooks)
cookbookRouter.post('/', httpCreateCookbook)
cookbookRouter.patch('/', httpUpdateCookbook)
cookbookRouter.delete('/', httpDeleteCookbook)

