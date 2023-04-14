import type { Knex } from 'knex'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({
  path: path.resolve(__dirname, '..', '..', '..', '.env'),
})

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'postgresql',
    connection: {
      database: process.env.DATABASE,
      user: process.env.DEV_DB_USER,
      password: process.env.DEV_DB_PASS,
      multipleStatements: true,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
      multipleStatements: true,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
      multipleStatements: true,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
}

export default config
