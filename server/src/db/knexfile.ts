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
      database: process.env.DEV_DB,
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
      database: process.env.PROD_DB,
      host: process.env.DEV_DB_HOST,
      port: Number(process.env.BASTION_PORT),
      user: process.env.PROD_DB_USER,
      password: process.env.PROD_DB_PASS,
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
      database: process.env.PROD_DB,
      host: process.env.PROD_DB_HOST,
      port: Number(process.env.PROD_DB_PORT),
      user: process.env.PROD_DB_USER,
      password: process.env.PROD_DB_PASS,
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
