import knex from '../db/db'
import { ICookbook } from '../types/@types.cookbooks'

export async function dbGetCookbooks(guid: string) {
  try {
    return await knex.raw(`
        SELECT
          c.guid,
          u.guid AS creator_user_guid,
          c.cookbook_name,
          c.created_at,
          c.updated_at FROM cookbooks c
        JOIN users u ON u.id = c.creator_user_id
        JOIN cookbook_members cm ON cm.cookbook_id = c.id
        WHERE u.guid = '${guid}'
        OR cm.cookbook_id = c.id
        ORDER BY c.updated_at
    `)
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

export async function dbUpdateCookbook(cookbook_guid: string, cookbook_name: string) {
  try {
    return await knex('cookbooks')
      .update('cookbook_name', cookbook_name)
      .where('cookbook_guid', '=', cookbook_guid)
  } catch (e) {
    console.error(e)
  }
}
