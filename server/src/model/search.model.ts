import knex from '../db/db'

export async function dbTagSearchRecipesByCookbook(
  tag_name: string,
  cookbook_guid: string | undefined
) {
  try {
    return await knex.raw(`
      SELECT
        r.guid,
        r.name,
        r.image,
        r.cook_time,
        r.prep_time,
        r.total_time,
        r.is_private,
        r.created_at,
        r.updated_at,
        STRING_AGG(tag_types.tag_name,',') as tags
      FROM recipes r
      JOIN cookbooks ON cookbooks.id = r.cookbook_id
      LEFT JOIN tags ON r.id = tags.recipe_id
      LEFT JOIN tag_types ON tag_types.id = tags.tag_type_id
      WHERE cookbooks.guid = '${cookbook_guid}'
      GROUP BY
        r.guid,
        r.name,
        r.image,
        r.cook_time,
        r.prep_time,
        r.total_time,
        r.is_private,
        r.created_at,
        r.updated_at,
      HAVING '${tag_name}' IN (STRING_AGG(tag_types.tag_name,','))
      ORDER BY created_at DESC
    `)
  } catch (e) {
    console.error(e)
  }
}

export async function dbTagSearchRecipes(
  tag_name: string,
  user_guid: string | undefined
) {
  try {
    return await knex.raw(`
      SELECT
        r.guid,
        r.name,
        r.image,
        r.cook_time,
        r.prep_time,
        r.total_time,
        r.is_private,
        r.created_at,
        r.updated_at,
        STRING_AGG(tag_types.tag_name,',') as tags
      FROM recipes r
      JOIN users u ON u.id = r.creator_user_id
      JOIN cookbook_members cm ON cm.cookbook_id = r.cookbook_id
      LEFT JOIN tags ON r.id = tags.recipe_id
      LEFT JOIN tag_types ON tag_types.id = tags.tag_type_id
      WHERE u.guid = '${user_guid}'
      GROUP BY
        r.guid,
        r.name,
        r.image,
        r.cook_time,
        r.prep_time,
        r.total_time,
        r.is_private,
        r.created_at,
        r.updated_at
      HAVING '${tag_name}' IN (STRING_AGG(tag_types.tag_name,','))
      ORDER BY created_at DESC
    `)
  } catch (e) {
    console.error(e)
  }
}

export async function dbCharSearchRecipes(searchVal: string, user_guid: string) {
  try {
    return await knex.raw(`
      SELECT DISTINCT name, r.guid FROM recipes r
      JOIN cookbooks c ON c.id = r.cookbook_id
      JOIN users u ON u.id = c.creator_user_id
      JOIN cookbook_members cm ON cm.cookbook_id = c.id
      WHERE name ILIKE '%${searchVal}%'
      AND u.guid = '${user_guid}'
        UNION ALL
      SELECT DISTINCT CONCAT('#', tag_name), tt.guid from tag_types tt
      JOIN tags t on t.tag_type_id = tt.id
      JOIN recipes r on r.id = t.recipe_id
      JOIN cookbooks c ON c.id = r.cookbook_id
      JOIN users u ON u.id = c.creator_user_id
      JOIN cookbook_members cm ON cm.cookbook_id = c.id
      WHERE tag_name ILIKE '%${searchVal}%'
      AND u.guid = '${user_guid}'
    `)
  } catch (e) {
    console.error(e)
  }
}

export async function dbCharSearchRecipesByCookbook(cookbook_guid: string, searchVal: string) {
  try {
  } catch (e) {
    console.error(e)
  }
}
