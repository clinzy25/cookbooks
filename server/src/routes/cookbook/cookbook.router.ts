import express from 'express'
import { httpGetCookbook } from './cookbook.controller'

export const cookbookRouter = express.Router()

cookbookRouter.get('/', httpGetCookbook)
