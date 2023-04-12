import knex from '../db/db'

export async function getRecipes(guid: string) {
  try {
    return await knex
      .select(
        'r.guid',
        'r.recipe_name',
        'r.image',
        'r.source',
        'r.source_type',
        'r.recipe_body',
        'r.description',
        'r.instructions',
        'r.notes',
        'r.servings',
        'r.prep_time',
        'r.cook_time',
        'r.author_name',
        'r.is_private',
        'r.created_at',
        'r.updated_at',
        knex.raw("STRING_AGG(DISTINCT tag_types.tag_name,',') as tags")
      )
      .from('recipes as r')
      .join('cookbooks', 'cookbooks.id', '=', 'r.cookbook_id')
      .join('tags', 'r.id', '=', 'tags.recipe_id')
      .join('tag_types', 'tag_types.id', '=', 'tags.tag_type_id')
      .where({ 'cookbooks.guid': guid })
      .groupBy(
        'r.guid',
        'r.recipe_name',
        'r.image',
        'r.source',
        'r.source_type',
        'r.recipe_body',
        'r.description',
        'r.instructions',
        'r.notes',
        'r.servings',
        'r.prep_time',
        'r.cook_time',
        'r.author_name',
        'r.is_private',
        'r.created_at',
        'r.updated_at'
      )
  } catch (e) {
    console.error(e)
  }
}
