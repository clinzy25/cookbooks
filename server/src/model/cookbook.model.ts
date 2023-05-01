import knex from '../db/db'

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

export async function dbCreateCookbook(cookbook_name: string, creator_user_guid: string) {
  try {
    return await knex.raw(`
      INSERT INTO cookbooks(cookbook_name, creator_user_id, created_at, updated_at)
      SELECT '${cookbook_name}' AS cookbook_name, id, ${knex.fn.now()}, ${knex.fn.now()} FROM users
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
      .where('guid', '=', cookbook_guid)
      .update({ cookbook_name, updated_at: knex.fn.now() }, ['cookbook_name'])
  } catch (e) {
    console.error(e)
  }
}

export async function dbDeleteCookbook(cookbook_guid: string) {
  try {
    return await knex('cookbooks').where('guid', cookbook_guid).del(['cookbook_name'])
  } catch (e) {
    console.error(e)
  }
}
