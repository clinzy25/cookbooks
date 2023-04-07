import knexConfig from './knexfile'

// eslint-disable-next-line
const knex = require('knex')(knexConfig[process.env.NODE_ENV ?? 'development'])

export default knex
