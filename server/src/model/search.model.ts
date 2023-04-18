import knex from '../db/db'

export async function searchRecipesByTag(tagName: string, cookbookGuid: string | undefined) {
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
        STRING_AGG(DISTINCT tag_types.tag_name,',') as tags
      FROM recipes r
      JOIN cookbooks ON cookbooks.id = r.cookbook_id
      LEFT JOIN tags ON r.id = tags.recipe_id
      LEFT JOIN tag_types ON tag_types.id = tags.tag_type_id
      WHERE '${tagName}' IN (SELECT tag_name FROM tag_types tt WHERE tt.id = tags.tag_type_id )
      AND cookbooks.guid = '${cookbookGuid}'
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
      ORDER BY created_at DESC
    `)
  } catch (e) {
    console.error(e)
  }
}
