import knex from '../db/db'
import { ICookbook } from '../routes/cookbook/@types.cookbooks'

export async function getCookbooks(guid: string) {
  try {
    return await knex
      .select('c.guid', 'c.cookbook_name', 'c.created_at', 'c.updated_at')
      .from('cookbooks as c')
      .join('users', 'users.id', '=', 'c.creator_user_id')
      .where({ 'users.guid': guid })
  } catch (e) {
    console.error(e)
  }
}

export async function createCookbook(cookbook: ICookbook) {
  const { cookbook_name, creator_user_guid } = cookbook
  try {
    return await knex.raw(`
      INSERT INTO cookbooks(cookbook_name, creator_user_id, created_at, updated_at)
      SELECT '${cookbook_name}' as cookbook_name, id, ${knex.fn.now()}, ${knex.fn.now()} FROM users
      WHERE users.guid = '${creator_user_guid}'
      RETURNING cookbooks.cookbook_name
    `)
  } catch (e) {
    console.error(e)
  }
}
