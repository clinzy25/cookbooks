import knex from '../db/db'

export async function getCookbook(guid: string) {
  try {
    return await knex
      .select('c.guid', 'c.cookbook_name', 'c.created_at', 'c.updated_at')
      .from('cookbooks as c')
      .join('users', 'users.id', '=', 'c.creator_user_id')
      .where({ 'users.guid': guid })
  } catch (error) {
    console.error(error)
  }
}
