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
        'r.updated_at'
      )
      .from('recipes as r')
      .join('cookbooks', 'cookbooks.id', '=', 'r.cookbook_id')
      .where({ 'cookbooks.guid': guid })
  } catch (e) {
    console.error(e)
  }
}
