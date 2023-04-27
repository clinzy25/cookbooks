import express from 'express'
import { httpDeleteTags, httpGetTags, httpUpdateTag } from './tags.controller'

export const tagsRouter = express.Router()

tagsRouter.get('/', httpGetTags)
tagsRouter.patch('/', httpUpdateTag)
tagsRouter.delete('/', httpDeleteTags)
