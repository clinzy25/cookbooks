import express from 'express'
import { httpGetCookbookMembers } from './user.controller'

export const userRouter = express.Router()

userRouter.get('/cookbook', httpGetCookbookMembers)
