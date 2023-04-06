import express, { Express, Request, Response } from 'express'
import path from 'path'
require('dotenv').config({
  path: path.resolve(__dirname, '..', '..', '.env'),
})

const app: Express = express()
const port = 8080

app.get('/', (req: Request, res: Response) => {
  res.send('Good to gooo')
})

app.listen(port, () => console.log(`Server is running on port ${port}`))
