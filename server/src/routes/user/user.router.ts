import express from 'express'
import { httpGetCookbookMembers, httpSendInvite } from './user.controller'

export const userRouter = express.Router()

userRouter.get('/cookbook', httpGetCookbookMembers)
userRouter.post('/invite', httpSendInvite)
