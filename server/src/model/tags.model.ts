import knex from '../db/db'
import { ITag } from '../types/@types.tags'

export async function dbGetTagsByCookbook(cookbook_guid: string) {
  try {
    return await knex.raw(`
      SELECT * FROM (
        SELECT DISTINCT ON (tag_name) tag_name, t.guid, weight FROM tag_types tt
        LEFT JOIN tags t ON t.tag_type_id = tt.id
        JOIN recipes r ON r.id = t.recipe_id
        JOIN cookbooks c ON c.id = r.cookbook_id
        JOIN users u ON u.id = c.creator_user_id
        WHERE c.guid = '${cookbook_guid}'
        GROUP BY tag_name, weight, t.guid
        ORDER BY tag_name DESC
      ) sub 
      ORDER BY weight DESC
    `)
  } catch (e) {
    console.error(e)
  }
}

export async function dbGetTagsByUser(user_guid: string) {
  try {
    return await knex.raw(`
      SELECT * FROM (
        SELECT DISTINCT ON (tag_name) tag_name, t.guid, weight FROM tag_types tt
        LEFT JOIN tags t ON t.tag_type_id = tt.id
        JOIN recipes r ON r.id = t.recipe_id
        JOIN cookbooks c ON c.id = r.cookbook_id
        JOIN users u ON u.id = c.creator_user_id
        JOIN cookbook_members cm ON cm.cookbook_id = c.id
        WHERE u.guid = '${user_guid}'
        OR cm.cookbook_id = c.id
        GROUP BY tag_name, weight, t.guid
        ORDER BY tag_name DESC
      ) sub
      ORDER BY weight DESC
    `)
  } catch (e) {
    console.error(e)
  }
}

export async function dbDeleteTags(tags: ITag[]) {
  try {
    return await knex.raw(`
      DELETE FROM tags
      WHERE tags.guid = (${tags.map(t => `('${t.guid}')`).join(',')})
      RETURNING tags.guid
    `)
  } catch (e) {
    console.error(e)
  }
}

export async function dbUpdateTag(tag: ITag) {
  const { guid, tag_name } = tag
  try {
    return await knex('tags').where('guid', '=', guid).update({ tag_name }, ['tag_name'])
  } catch (e) {
    console.error(e)
  }
}
