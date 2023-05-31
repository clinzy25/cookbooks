import knex from '../db/db'
import { IEditTagReq, ITag } from '../types/@types.tags'

export async function dbGetTagsByCookbook(cookbook_guid: string, limit: number, offset: number) {
  try {
    return await knex.raw(`
      SELECT * FROM (
        SELECT DISTINCT ON (t.tag_name) t.tag_name, tt.weight AS weight, t.guid FROM tags t
        JOIN (
          SELECT COUNT(tag_name)::integer as weight, tag_name FROM tags
          JOIN recipes r ON r.id = tags.recipe_id
          JOIN cookbooks c ON c.id = r.cookbook_id
          WHERE c.guid = '${cookbook_guid}'
          GROUP BY tag_name
        ) tt ON t.tag_name = tt.tag_name
        JOIN recipes r ON r.id = t.recipe_id
        JOIN cookbooks c ON c.id = r.cookbook_id
        WHERE c.guid = '${cookbook_guid}'
        GROUP BY t.tag_name, t.guid, tt.weight
      ) sub 
      ORDER BY weight DESC
      LIMIT ${limit} OFFSET ${offset}
    `)
  } catch (e) {
    console.error(e)
  }
}

export async function dbGetTagsByUser(user_guid: string, limit: number, offset: number) {
  try {
    return await knex.raw(`
      SELECT * FROM (
        SELECT DISTINCT ON (t.tag_name) t.tag_name, tt.weight AS weight, t.guid FROM tags t
        JOIN (
          SELECT COUNT(tag_name)::integer as weight, tag_name FROM tags t
          JOIN recipes r ON r.id = t.recipe_id
          JOIN cookbooks c ON c.id = r.cookbook_id
          JOIN users u ON u.id = c.creator_user_id
          LEFT JOIN cookbook_members cm ON cm.cookbook_id = c.id
          WHERE u.guid = '${user_guid}'
          OR cm.cookbook_id = c.id
          GROUP BY tag_name
        ) tt ON t.tag_name = tt.tag_name
        JOIN recipes r ON r.id = t.recipe_id
        JOIN cookbooks c ON c.id = r.cookbook_id
        JOIN users u ON u.id = c.creator_user_id
        LEFT JOIN cookbook_members cm ON cm.cookbook_id = c.id
        WHERE u.guid = '${user_guid}'
        OR cm.cookbook_id = c.id
        GROUP BY t.tag_name, t.guid, tt.weight
      ) sub
      ORDER BY weight DESC
      LIMIT ${limit} OFFSET ${offset}
    `)
  } catch (e) {
    console.error(e)
  }
}

export async function dbDeleteTags(tags: ITag[], cookbook_guid: string) {
  try {
    return await knex.raw(`
      DELETE FROM tags t
      USING recipes AS r,
            cookbooks AS c
      WHERE r.id = t.recipe_id
      AND c.id = r.cookbook_id
      AND t.tag_name IN (${tags.map(t => `'${t.tag_name}'`).join(',')})
      AND c.guid = '${cookbook_guid}'
      RETURNING t.tag_name
    `)
  } catch (e) {
    console.error(e)
  }
}

export async function dbUpdateTags(tags: IEditTagReq[], cookbook_guid: string) {
  try {
    return await Promise.all(
      tags.map(
        async tag =>
          await knex.raw(`
        UPDATE tags AS t
        SET tag_name = '${tag.new_tag_name}'
        FROM recipes r, 
             cookbooks c
        WHERE r.id = t.recipe_id
        AND c.id = r.cookbook_id
        AND c.guid = '${cookbook_guid}'
        AND tag_name = '${tag.tag_name}'
        RETURNING t.tag_name
    `)
      )
    )
  } catch (e) {
    console.error(e)
  }
}
