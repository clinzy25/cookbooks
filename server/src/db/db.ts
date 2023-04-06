import knexConfig from './knexfile'

const knex = require('knex')(knexConfig[process.env.NODE_ENV!])
