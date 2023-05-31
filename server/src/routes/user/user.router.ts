import express from 'express'
import { httpGetCookbookMembers, httpSendInvite, httpCreateUser } from './user.controller'

export const userRouter = express.Router()

userRouter.post('/create', httpCreateUser)
userRouter.get('/cookbook', httpGetCookbookMembers)
userRouter.post('/invite', httpSendInvite)
