import knex from '../db/db'

export async function dbTagSearchRecipesByCookbook(params: {
  tag_name: string
  cookbook_guid?: string
}) {
  try {
    return await knex.raw(
      `
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
        (SELECT STRING_AGG(t2.tag_name, ',') 
          FROM tags t2 
          WHERE t2.recipe_id = r.id) 
        AS tags
      FROM recipes r
      JOIN cookbooks ON cookbooks.id = r.cookbook_id
      LEFT JOIN tags t ON r.id = t.recipe_id
      WHERE t.tag_name = :tag_name
      AND cookbooks.guid = :cookbook_guid
      GROUP BY
        r.id,
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
    `,
      params
    )
  } catch (e) {
    console.error(e)
  }
}

export async function dbTagSearchRecipes(params: { tag_name: string; user_guid: string }) {
  try {
    return await knex.raw(
      `
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
        (SELECT STRING_AGG(t2.tag_name, ',') 
          FROM tags t2 
          WHERE t2.recipe_id = r.id) 
        AS tags
      FROM recipes r
      JOIN users u ON u.id = r.creator_user_id
      LEFT JOIN cookbook_members cm ON cm.cookbook_id = r.cookbook_id
      LEFT JOIN tags t ON r.id = t.recipe_id
      WHERE t.tag_name = :tag_name
      AND (
        u.guid = :user_guid
        OR cm.cookbook_id = r.cookbook_id
      )
      GROUP BY
        r.id,
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
    `,
      params
    )
  } catch (e) {
    console.error(e)
  }
}

export async function dbCharSearchRecipes(params: {
  search_val: string
  user_guid?: string
  cookbook_guid?: string
}) {
  let whereClause = ''
  if (params.user_guid) whereClause = `AND (u.guid = :user_guid OR cm.cookbook_id = c.id)`
  if (params.cookbook_guid) whereClause = `AND c.guid = :cookbook_guid`
  try {
    return await knex.raw(
      `
      (SELECT DISTINCT ON (name)
        name, 
        r.guid, 
        c.guid AS cookbook_guid,
        u.guid AS creator_user_guid
      FROM recipes r
      JOIN cookbooks c ON c.id = r.cookbook_id
      JOIN users u ON u.id = c.creator_user_id
      LEFT JOIN cookbook_members cm ON cm.cookbook_id = c.id
      WHERE name ILIKE '%' || :search_val || '%'
      ${whereClause}
      LIMIT 10)
        UNION ALL
      (SELECT DISTINCT ON (tag_name) CONCAT('#', tag_name), 
        t.guid, 
        c.guid AS cookbook_guid,
        u.guid AS creator_user_guid
        FROM tags t
      JOIN recipes r ON r.id = t.recipe_id
      JOIN cookbooks c ON c.id = r.cookbook_id
      JOIN users u ON u.id = c.creator_user_id
      LEFT JOIN cookbook_members cm ON cm.cookbook_id = c.id
      WHERE tag_name ILIKE '%' || :search_val || '%'
      ${whereClause}
      LIMIT 10)
    `,
      params
    )
  } catch (e) {
    console.error(e)
  }
}
