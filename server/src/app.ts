import express, { Express, NextFunction, Request, Response, Router } from 'express'
import path from 'path'
import dotenv from 'dotenv'
import cors from 'cors'
import { api } from './routes/api'
import { errorHandler } from './utils/utils.errors'
import { S3 } from '@aws-sdk/client-s3'
import helmet from 'helmet'
import morgan from 'morgan'

dotenv.config({
  path: path.resolve(__dirname, '..', '..', '.env'),
})

export const app: Express = express()
export const router: Router = express.Router()

export const s3Client = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const port = process.env.SERVER_PORT
const corsOptions = {
  origin: ['http://localhost:3000', 'https://cook-books.io'],
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(helmet())
app.use(morgan('tiny'))
app.use('/v1', api)
app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, res)
  next()
})

app.get('/', (_req: Request, res: Response) => res.send('Good to gooo'))

app.listen(port, () => console.log(`Server is running on port ${port}`))
