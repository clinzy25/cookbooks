import knex from '../db/db'

export async function dbTagSearchRecipesByCookbook(tag_name: string, cookbook_guid?: string) {
  try {
    return await knex.raw(`
      SELECT
        r.guid,
        r.name,
        r.image,
        r.base64_image,
        r.cook_time,
        r.prep_time,
        r.total_time,
        r.is_private,
        r.created_at,
        r.updated_at,
        STRING_AGG(t.tag_name,',') as tags
      FROM recipes r
      JOIN cookbooks ON cookbooks.id = r.cookbook_id
      LEFT JOIN tags t ON r.id = t.recipe_id
      WHERE t.tag_name = '${tag_name}'
      AND cookbooks.guid = '${cookbook_guid}'
      GROUP BY
        r.guid,
        r.name,
        r.image,
        r.base64_image,
        r.cook_time,
        r.prep_time,
        r.total_time,
        r.is_private,
        r.created_at,
        r.updated_at
      ORDER BY created_at DESC
    `)
  } catch (e) {
    console.error(e)
  }
}

export async function dbTagSearchRecipes(tag_name: string, user_guid: string) {
  try {
    return await knex.raw(`
      SELECT
        r.guid,
        r.name,
        r.image,
        r.base64_image,
        r.cook_time,
        r.prep_time,
        r.total_time,
        r.is_private,
        r.created_at,
        r.updated_at,
        STRING_AGG(t.tag_name,',') as tags
      FROM recipes r
      JOIN users u ON u.id = r.creator_user_id
      JOIN cookbook_members cm ON cm.cookbook_id = r.cookbook_id
      LEFT JOIN tags t ON r.id = t.recipe_id
      WHERE t.tag_name = '${tag_name}'
      AND (
        u.guid = '${user_guid}' 
        OR cm.cookbook_id = r.cookbook_id
      )
      GROUP BY
        r.guid,
        r.name,
        r.image,
        r.base64_image,
        r.cook_time,
        r.prep_time,
        r.total_time,
        r.is_private,
        r.created_at,
        r.updated_at
      ORDER BY created_at DESC
    `)
  } catch (e) {
    console.error(e)
  }
}

export async function dbCharSearchRecipes(
  searchVal: string,
  user_guid?: string,
  cookbook_guid?: string
) {
  let whereClause = ''
  if (user_guid) whereClause = `AND u.guid = '${user_guid}'`
  if (cookbook_guid) whereClause = `AND c.guid = '${cookbook_guid}'`
  try {
    return await knex.raw(`
      (SELECT DISTINCT name, r.guid, c.guid AS cookbook_guid FROM recipes r
      JOIN cookbooks c ON c.id = r.cookbook_id
      JOIN users u ON u.id = c.creator_user_id
      JOIN cookbook_members cm ON cm.cookbook_id = c.id
      WHERE name ILIKE '%${searchVal}%'
      ${whereClause}
      LIMIT 10)
        UNION ALL
      (SELECT DISTINCT ON (tag_name) CONCAT('#', tag_name), t.guid, c.guid AS cookbook_guid from tags t
      JOIN recipes r ON r.id = t.recipe_id
      JOIN cookbooks c ON c.id = r.cookbook_id
      JOIN users u ON u.id = c.creator_user_id
      JOIN cookbook_members cm ON cm.cookbook_id = c.id
      WHERE tag_name ILIKE '%${searchVal}%'
      ${whereClause}
      LIMIT 10)
    `)
  } catch (e) {
    console.error(e)
  }
}
