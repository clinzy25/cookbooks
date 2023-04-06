import knexConfig from './knexfile'
import knex from 'knex'

knex(knexConfig[process.env.NODE_ENV ?? 'development'])
