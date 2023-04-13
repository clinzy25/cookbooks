import { Knex } from 'knex'

const uuid = (knex: Knex) => knex.raw('uuid_generate_v4()')

export async function up(knex: Knex): Promise<void> {
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
      table.integer('creator_user_id').unsigned()
      table.foreign('creator_user_id').references('users.id')
      table.integer('member_user_id').unsigned()
      table.foreign('member_user_id').references('users.id')
      table.integer('cookbook_id').unsigned()
      table.foreign('cookbook_id').references('cookbooks.id')
      table.timestamps()
    })
    .createTable('invites', function (table) {
      table.increments('id').primary()
      table.uuid('guid', { useBinaryUuid: true }).defaultTo(uuid(knex))
      table.integer('sender_user_id').unsigned()
      table.foreign('sender_user_id').references('users.id')
      table.integer('recipient_user_id').unsigned()
      table.foreign('recipient_user_id').references('users.id')
      table.integer('cookbook_id').unsigned()
      table.foreign('cookbook_id').references('cookbooks.id')
      table.integer('accepted').notNullable()
      table.timestamps()
    })
    .createTable('recipes', function (table) {
      table.increments('id').primary()
      table.uuid('guid', { useBinaryUuid: true }).defaultTo(uuid(knex))
      table.integer('cookbook_id').unsigned()
      table.foreign('cookbook_id').references('cookbooks.id')
      table.integer('creator_user_id').unsigned()
      table.foreign('creator_user_id').references('users.id')
      table.string('recipe_name', 100).notNullable()
      table.string('image', 250)
      table.string('source', 250)
      table.string('source_type', 50).checkIn(['link', 'form', 'camera'])
      table.jsonb('recipe_body')
      table.text('description', 'text')
      table.text('instructions', 'text')
      table.text('notes', 'text')
      table.integer('servings')
      table.string('prep_time', 100)
      table.string('cook_time', 100)
      table.string('author_name', 100)
      table.integer('is_private').notNullable().defaultTo(0)
      table.timestamps()
    })
    .createTable('ingredient_types', function (table) {
      table.increments('id').primary()
      table.uuid('guid', { useBinaryUuid: true }).defaultTo(uuid(knex))
      table.string('ingredient_name', 100).notNullable()
    })
    .createTable('ingredients', function (table) {
      table.increments('id').primary()
      table.uuid('guid', { useBinaryUuid: true }).defaultTo(uuid(knex))
      table.integer('ingredient_type_id').unsigned()
      table.foreign('ingredient_type_id').references('ingredient_types.id')
      table.integer('recipe_id').unsigned()
      table.foreign('recipe_id').references('recipes.id')
      table.string('unit', 50).notNullable()
      table.decimal('amount').notNullable()
    })
    .createTable('tag_types', function (table) {
      table.increments('id').primary()
      table.uuid('guid', { useBinaryUuid: true }).defaultTo(uuid(knex))
      table.string('tag_name', 50).notNullable()
    })
    .createTable('tags', function (table) {
      table.increments('id').primary()
      table.uuid('guid', { useBinaryUuid: true }).defaultTo(uuid(knex))
      table.integer('recipe_id').unsigned()
      table.foreign('recipe_id').references('recipes.id')
      table.integer('tag_type_id').unsigned()
      table.foreign('tag_type_id').references('tag_types.id')
    })
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(
    'DROP TABLE users, cookbook_members, invites, cookbooks, recipes, ingredients, ingredient_types, tags, tag_types CASCADE;'
  )
}
