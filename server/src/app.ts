import express, { Express, Request, Response } from 'express'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({
  path: path.resolve(__dirname, '..', '..', '.env'),
})

const app: Express = express()
const port = process.env.SERVER_PORT

app.get('/', (_req: Request, res: Response) => {
  res.send('Good to gooo')
})

app.listen(port, () => console.log(`Server is running on port ${port}`))
