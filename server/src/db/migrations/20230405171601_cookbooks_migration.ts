import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable('users', function (table) {
      table.increments('id').primary();
      table.string('username', 100).notNullable();
      table.string('email', 100).notNullable();
      table.string('password', 250).notNullable();
      table.timestamps();
    })
    .createTable('cookbooks', function (table) {
      table.increments('id').primary();
      table.integer('creator_user_id').unsigned();
      table.foreign('creator_user_id').references('users.id');
      table.string('cookbook_name', 100);
      table.timestamps();
    })
    .createTable('cookbook_members', function (table) {
      table.increments('id').primary();
      table.integer('creator_user_id').unsigned();
      table.foreign('creator_user_id').references('users.id');
      table.integer('member_user_id').unsigned();
      table.foreign('member_user_id').references('users.id');
      table.integer('cookbook_id').unsigned();
      table.foreign('cookbook_id').references('cookbooks.id');
      table.timestamps();
    })
    .createTable('invites', function (table) {
      table.increments('id').primary();
      table.integer('sender_user_id').unsigned();
      table.foreign('sender_user_id').references('users.id');
      table.integer('recipient_user_id').unsigned();
      table.foreign('recipient_user_id').references('users.id');
      table.integer('cookbook_id').unsigned();
      table.foreign('cookbook_id').references('cookbooks.id');
      table.integer('accepted').notNullable();
      table.timestamps();
    })
    .createTable('recipes', function (table) {
      table.increments('id').primary();
      table.integer('cookbook_id').unsigned();
      table.foreign('cookbook_id').references('cookbooks.id');
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('users.id');
      table.string('recipe_name', 100).notNullable();
      table.string('image', 250);
      table.text('description', 'text');
      table.integer('servings');
      table.string('prep_time', 100);
      table.string('cook_time', 100);
      table.string('author_name', 100);
      table.integer('is_private').notNullable().defaultTo(0);
      table.timestamps();
    })
    .createTable('ingredient_types', function (table) {
      table.increments('id').primary();
      table.string('ingredient_name', 100).notNullable();
      table.timestamps();
    })
    .createTable('ingredients', function (table) {
      table.increments('id').primary();
      table.integer('ingredient_type_id').unsigned();
      table.foreign('ingredient_type_id').references('ingredient_types.id');
      table.integer('recipe_id').unsigned();
      table.foreign('recipe_id').references('recipes.id');
      table.string('unit', 50).notNullable();
      table.integer('amount').notNullable();
      table.timestamps();
    })
    .createTable('instructions', function (table) {
      table.increments('id').primary();
      table.integer('recipe_id').unsigned();
      table.foreign('recipe_id').references('recipes.id');
      table.text('instruction_body', 'text').notNullable();
      table.timestamps();
    })
    .createTable('notes', function (table) {
      table.increments('id').primary();
      table.integer('recipe_id').unsigned();
      table.foreign('recipe_id').references('recipes.id');
      table.text('note_body', 'text').notNullable();
      table.timestamps();
    })
    .createTable('tag_types', function (table) {
      table.increments('id').primary();
      table.string('tag_name', 50).notNullable();
      table.timestamps();
    })
    .createTable('tags', function (table) {
      table.increments('id').primary();
      table.integer('recipe_id').unsigned();
      table.foreign('recipe_id').references('recipes.id');
      table.integer('tag_type_id').unsigned();
      table.foreign('tag_type_id').references('tag_types.id');
      table.timestamps();
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('users')
    .dropTable('cookbook_members')
    .dropTable('invites')
    .dropTable('cookbooks')
    .dropTable('recipes')
    .dropTable('ingredients')
    .dropTable('ingredient_types')
    .dropTable('instructions')
    .dropTable('notes')
    .dropTable('tags')
    .dropTable('tag_types');
}
