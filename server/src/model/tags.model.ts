import knex from '../db/db'

export async function dbGetTagsByCookbook(cookbook_guid: string) {
  try {
    return await knex.raw(`
      SELECT tag_name, t.guid FROM tag_types tt
      LEFT JOIN tags t ON t.tag_type_id = tt.id
      JOIN recipes r ON r.id = t.recipe_id
      JOIN cookbooks as c ON c.id = r.cookbook_id
      JOIN users u ON u.id = c.creator_user_id
      WHERE c.guid = '${cookbook_guid}'
      GROUP BY tag_name, weight, t.guid
      ORDER BY weight DESC
    `)
  } catch (e) {
    console.error(e)
  }
}

export async function dbGetTagsByUser(user_guid: string) {
  try {
    return await knex.raw(`
      SELECT tag_name, t.guid FROM tag_types tt
      LEFT JOIN tags t ON t.tag_type_id = tt.id
      JOIN recipes r ON r.id = t.recipe_id
      JOIN cookbooks as c ON c.id = r.cookbook_id
      JOIN users u ON u.id = c.creator_user_id
      JOIN cookbook_members cm ON cm.cookbook_id = c.id
      WHERE u.guid = '${user_guid}'
      OR cm.cookbook_id = c.id
      GROUP BY tag_name, weight, t.guid
      ORDER BY weight DESC
    `)
  } catch (e) {
    console.error(e)
  }
}
