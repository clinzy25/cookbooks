import knex from '../db/db'
import { IRecipe } from '../types/@types.recipes'

export async function getCookbookRecipes(guid: string) {
  try {
    return await knex
      .select(
        'r.guid',
        'r.name',
        'r.image',
        'r.cook_time',
        'r.prep_time',
        'r.total_time',
        'r.is_private',
        'r.created_at',
        'r.updated_at',
        knex.raw("STRING_AGG(DISTINCT tag_types.tag_name,',') as tags")
      )
      .from('recipes as r')
      .join('cookbooks', 'cookbooks.id', '=', 'r.cookbook_id')
      .leftJoin('tags', 'r.id', '=', 'tags.recipe_id')
      .leftJoin('tag_types', 'tag_types.id', '=', 'tags.tag_type_id')
      .where({ 'cookbooks.guid': guid })
      .orderBy('created_at', 'desc')
      .groupBy(
        'r.guid',
        'r.name',
        'r.image',
        'r.cook_time',
        'r.prep_time',
        'r.total_time',
        'r.is_private',
        'r.created_at',
        'r.updated_at'
      )
  } catch (e) {
    console.error(e)
  }
}

export async function getRecipe(guid: string) {
  try {
    return await knex
      .select(
        'r.guid',
        'r.name',
        'r.image',
        'r.description',
        'r.cook_time',
        'r.cook_original_format',
        'r.prep_time',
        'r.prep_original_format',
        'r.total_time',
        'r.total_original_format',
        'r.yield',
        'r.ingredients',
        'r.instructions',
        'r.recipe_body',
        'r.notes',
        'r.source_url',
        'r.source_type',
        'r.is_private',
        'r.created_at',
        'r.updated_at',
        knex.raw("STRING_AGG(DISTINCT tag_types.tag_name,',') as tags")
      )
      .from('recipes as r')
      .join('tags', 'r.id', '=', 'tags.recipe_id')
      .join('tag_types', 'tag_types.id', '=', 'tags.tag_type_id')
      .where({ 'r.guid': guid })
      .groupBy(
        'r.guid',
        'r.name',
        'r.image',
        'r.description',
        'r.cook_time',
        'r.cook_original_format',
        'r.prep_time',
        'r.prep_original_format',
        'r.total_time',
        'r.total_original_format',
        'r.yield',
        'r.ingredients',
        'r.instructions',
        'r.recipe_body',
        'r.notes',
        'r.source_url',
        'r.source_type',
        'r.is_private',
        'r.created_at',
        'r.updated_at'
      )
      .first()
  } catch (e) {
    console.error(e)
  }
}

export async function addRecipe(recipe: IRecipe) {
  const {
    cookbook_guid,
    name,
    image,
    description,
    cookTime: cook_time,
    prepTime: prep_time,
    totalTime: total_time,
    recipeYield,
    recipeIngredients: ingredients,
    recipeInstructions: instructions,
    url: source_url,
    source_type,
    is_private,
  } = recipe
  try {
    return await knex.raw(`
      INSERT INTO recipes(
        cookbook_id,
        creator_user_id,
        name,
        image,
        description,
        cook_time,
        prep_time,
        total_time,
        yield,
        ingredients,
        instructions,
        source_url,
        source_type,
        is_private,
        created_at,
        updated_at
        )
      SELECT id AS cookbook_id, creator_user_id, '${name}', '${image}', '${description}', '${cook_time}', '${prep_time}', '${total_time}', '${recipeYield}', '${JSON.stringify(
      ingredients
    )}', '${JSON.stringify(
      instructions
    )}', '${source_url}', '${source_type}', '${is_private}', ${knex.fn.now()}, ${knex.fn.now()} FROM cookbooks
      WHERE cookbooks.guid = '${cookbook_guid}'
      RETURNING recipes.name
    `)
  } catch (e) {
    console.error(e)
  }
}
