import knex from '../db/db'
import { ICookbook } from '../types/@types.cookbooks'

export async function dbGetCookbooks(guid: string) {
  try {
    return await knex
      .select(
        'c.guid',
        'u.guid as creator_user_guid',
        'c.cookbook_name',
        'c.created_at',
        'c.updated_at'
      )
      .from('cookbooks as c')
      .join('users as u', 'u.id', '=', 'c.creator_user_id')
      .where({ 'u.guid': guid })
  } catch (e) {
    console.error(e)
  }
}

export async function dbCreateCookbook(cookbook: ICookbook) {
  const { cookbook_name, creator_user_guid } = cookbook
  try {
    return await knex.raw(`
      INSERT INTO cookbooks(cookbook_name, creator_user_id, created_at, updated_at)
      SELECT '${cookbook_name}' as cookbook_name, id, ${knex.fn.now()}, ${knex.fn.now()} FROM users
      WHERE users.guid = '${creator_user_guid}'
      RETURNING cookbooks.guid
    `)
  } catch (e) {
    console.error(e)
  }
}
