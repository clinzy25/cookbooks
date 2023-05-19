import knexConfig from './knexfile'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({
  path: path.resolve(__dirname, '..', '..', '..', '.env'),
})

// eslint-disable-next-line
const knex = require('knex')(knexConfig[process.env.NODE_ENV ?? 'development'])

export default knex
