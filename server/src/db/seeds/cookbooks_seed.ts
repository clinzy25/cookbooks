import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();
  await knex('cookbooks').del();
  await knex('cookbook_members').del();
  await knex('invites').del();
  await knex('recipes').del();
  await knex('ingredient_types').del();
  await knex('ingredients').del();
  await knex('instructions').del();
  await knex('notes').del();
  await knex('tag_types').del();
  await knex('tags').del();

  await knex('users').insert([
    {
      username: 'clinzy',
      email: 'email@email.com',
      password: 'asdfabisdfybiasfgd',
      is_readonly: 0,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      username: 'qnt3n',
      email: 'email@email.com',
      password: 'asdfabisdfybiasfgd',
      is_readonly: 0,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      username: 'curbins',
      email: 'email@email.com',
      password: 'asdfabisdfybiasfgd',
      is_readonly: 0,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
}
