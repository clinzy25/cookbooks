import knex from '../db/db'
import { IRecipe } from '../types/@types.recipes'
import { transformParsedRecipe } from './transformers'

export async function dbGetCookbookRecipes(guid: string, limit: number, offset: number) {
  try {
    return await knex
      .select(
        'r.guid',
        'u.email AS creator_user_email',
        'u.guid AS creator_user_guid',
        'r.name',
        'r.image',
        'r.base64_image',
        'r.cook_time',
        'r.prep_time',
        'r.total_time',
        'r.is_private',
        'r.created_at',
        'r.updated_at',
        knex.raw("STRING_AGG(DISTINCT tags.tag_name,',') as tags")
      )
      .from('recipes as r')
      .join('cookbooks', 'cookbooks.id', '=', 'r.cookbook_id')
      .leftJoin('tags', 'r.id', '=', 'tags.recipe_id')
      .join('users as u', 'u.id', '=', 'r.creator_user_id')
      .where({ 'cookbooks.guid': guid })
      .orderBy('created_at', 'desc')
      .groupBy(
        'r.guid',
        'r.name',
        'u.email',
        'u.guid',
        'r.image',
        'r.base64_image',
        'r.cook_time',
        'r.prep_time',
        'r.total_time',
        'r.is_private',
        'r.created_at',
        'r.updated_at'
      )
      .limit(limit)
      .offset(offset)
  } catch (e) {
    console.error(e)
  }
}

export async function dbGetRecipe(guid: string) {
  try {
    return await knex
      .select(
        'r.guid',
        'u.guid AS creator_user_guid',
        'u.email AS creator_user_email',
        'r.name',
        'r.image',
        'r.base64_image',
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
        knex.raw("STRING_AGG(DISTINCT tags.tag_name,',') as tags")
      )
      .from('recipes as r')
      .leftJoin('tags', 'r.id', '=', 'tags.recipe_id')
      .join('users as u', 'u.id', '=', 'r.creator_user_id')
      .where({ 'r.guid': guid })
      .groupBy(
        'r.guid',
        'u.guid',
        'u.email',
        'r.name',
        'r.image',
        'r.base64_image',
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

export async function dbAddRecipe(recipe: IRecipe) {
  const {
    cookbook_guid,
    name,
    image,
    base64Image,
    description,
    cook_time,
    prep_time,
    total_time,
    recipeYield,
    ingredients,
    instructions,
    source_url,
    source_type,
    is_private,
    tags,
  } = transformParsedRecipe(recipe)

  try {
    return await knex.raw(`
      WITH insert_1 AS (
        INSERT INTO recipes(
          cookbook_id,
          creator_user_id,
          name,
          image,
          base64_image,
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
        SELECT id AS cookbook_id, creator_user_id, '${name}', NULLIF('${image}', 'null'),  NULLIF('${base64Image}', 'null'), NULLIF('${description}', 'null'), NULLIF('${cook_time}', 'null'),  NULLIF('${prep_time}', 'null'),  NULLIF('${total_time}', 'null'),  NULLIF('${recipeYield}', 'null'), '${ingredients}', '${instructions}', '${source_url}', '${source_type}', '${is_private}', ${knex.fn.now()}, ${knex.fn.now()} FROM cookbooks
        WHERE cookbooks.guid = '${cookbook_guid}'
        RETURNING recipes.id AS recipe_id 
        ),
        update_cookbook AS (
          UPDATE cookbooks c
          SET updated_at = ${knex.fn.now()}
          WHERE c.guid = '${cookbook_guid}'
        )
      INSERT INTO tags(recipe_id, tag_name)
      VALUES ${tags.map(t => `((SELECT recipe_id FROM insert_1), '${t}')`).join(',')}
      RETURNING recipe_id
    `)
  } catch (e) {
    console.error(e)
  }
}

export async function dbDeleteRecipe(recipe_guid: string) {
  try {
    return await knex('recipes').where({ guid: recipe_guid }).del().returning('guid')
  } catch (e) {
    console.error(e)
  }
}
