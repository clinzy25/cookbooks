import express from 'express'
import { httpGetTags } from './tags.controller'

export const tagsRouter = express.Router()

tagsRouter.get('/', httpGetTags)
