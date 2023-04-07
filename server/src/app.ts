import express, { Express, Request, Response, Router } from 'express'
import path from 'path'
import dotenv from 'dotenv'
import cors from 'cors'
import { api } from './routes/api'

dotenv.config({
  path: path.resolve(__dirname, '..', '..', '.env'),
})

export const router: Router = express.Router()
export const app: Express = express()

const port = process.env.SERVER_PORT
const corsOptions = {
  origin: ['http://localhost:3000'],
}

app.use(cors(corsOptions))
app.use('/v1', api)

app.get('/', (_req: Request, res: Response) => res.send('Good to gooo'))

app.listen(port, () => console.log(`Server is running on port ${port}`))
