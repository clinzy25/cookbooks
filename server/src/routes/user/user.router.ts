import express from 'express'
import { httpCreateIvite } from './user.controller'

export const userRouter = express.Router()

userRouter.post('/invites/create', httpCreateIvite)
