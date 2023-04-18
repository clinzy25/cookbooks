import knex from '../db/db'

export async function dbGetTags(cookbook_guid: string) {
  try {
    return await knex
      .select('tag_name')
      .from('tag_types as tt')
      .leftJoin('tags as t', 't.tag_type_id', '=', 'tt.id')
      .join('recipes as r', 'r.id', '=', 't.recipe_id')
      .join('cookbooks as c', 'c.id', '=', 'r.cookbook_id')
      .where({ 'c.guid': cookbook_guid })
      .orderBy('weight', 'desc')
      .groupBy('tag_name', 'weight')
  } catch (e) {
    console.error(e)
  }
}
