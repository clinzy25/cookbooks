import { Knex } from 'knex'

const uuid = (knex: Knex) => knex.raw('uuid_generate_v4()')

export async function up(knex: Knex): Promise<void> {
  if (knex.client.config.connection.host === '127.0.0.1') {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    await knex.schema
      .createTable('users', function (table) {
        table.increments('id').primary()
        table.string('guid', 100)
        table.string('username', 100).notNullable()
        table.string('email', 100).notNullable()
        table.string('password', 250).notNullable()
        table.integer('is_readonly').notNullable().defaultTo(0)
        table.timestamps()
      })
      .createTable('cookbooks', function (table) {
        table.increments('id').primary()
        table.uuid('guid', { useBinaryUuid: true }).defaultTo(uuid(knex))
        table.integer('creator_user_id').unsigned()
        table.foreign('creator_user_id').references('users.id')
        table.string('cookbook_name', 100)
        table.timestamps()
      })
      .createTable('cookbook_members', function (table) {
        table.increments('id').primary()
        table.uuid('guid', { useBinaryUuid: true }).defaultTo(uuid(knex))
        table.integer('member_user_id').unsigned()
        table.foreign('member_user_id').references('users.id')
        table.integer('cookbook_id').unsigned()
        table.foreign('cookbook_id').references('cookbooks.id').onDelete('CASCADE')
        table.string('email').notNullable()
        table.integer('invitation_accepted').notNullable().defaultTo(0)
        table.timestamps()
      })
      .createTable('recipes', function (table) {
        table.increments('id').primary()
        table.uuid('guid', { useBinaryUuid: true }).defaultTo(uuid(knex))
        table.integer('cookbook_id').unsigned().notNullable()
        table.foreign('cookbook_id').references('cookbooks.id').onDelete('CASCADE')
        table.integer('creator_user_id').unsigned().notNullable()
        table.foreign('creator_user_id').references('users.id').onDelete('CASCADE')
        table.string('name', 100).notNullable()
        table.string('image', 250)
        table.text('base64_image', 'text')
        table.text('description', 'text')
        table.string('cook_time', 100)
        table.string('cook_original_format', 100)
        table.string('prep_time', 100)
        table.string('prep_original_format', 100)
        table.string('total_time', 100)
        table.string('total_original_format', 100)
        table.string('yield', 50)
        table.jsonb('ingredients')
        table.jsonb('instructions')
        table.jsonb('recipe_body')
        table.text('notes', 'text')
        table.string('source_url', 250)
        table.string('source_type', 50).checkIn(['link', 'form', 'camera'])
        table.integer('is_private').notNullable().defaultTo(0)
        table.timestamps()
      })
      .createTable('tags', function (table) {
        table.increments('id').primary()
        table.uuid('guid', { useBinaryUuid: true }).defaultTo(uuid(knex))
        table.integer('recipe_id').unsigned()
        table.foreign('recipe_id').references('recipes.id').onDelete('CASCADE')
        table.string('tag_name', 50).notNullable()
      })
      .then()
  } else {
    throw new Error('Can only run migrations local database')
  }
}

export async function down(knex: Knex): Promise<void> {
  if (knex.client.config.connection.host === '127.0.0.1') {
    await knex.raw('DROP TABLE users, cookbook_members, cookbooks, recipes, tags CASCADE;')
  } else {
    throw new Error('Can only run migrations local database')
  }
}
