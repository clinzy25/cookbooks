import { IRecipe } from '../types/@types.recipes'
import { ISearchResults, ISearchResult } from '../types/@types.search'
import { IMemberResult, IMemberResults } from '../types/@types.users'

export const transformMembers = (sqlResult: IMemberResult[]): IMemberResults => {
  const result: IMemberResults = {
    members: [],
    pending_invites: [],
  }
  for (let i = 0; i < sqlResult.length; i++) {
    if (sqlResult[i].invitation_accepted) {
      result.members.push(sqlResult[i])
    } else {
      result.pending_invites.push(sqlResult[i])
    }
  }
  return result
}

export const transformSearchResults = (sqlResult: ISearchResult[]) => {
  const result: ISearchResults = {
    recipes: [],
    tags: [],
  }
  for (let i = 0; i < sqlResult.length; i++) {
    const sqlRes = sqlResult[i]
    if (sqlRes.name.charAt(0) === '#') {
      result.tags.push(sqlRes)
    } else {
      const recipe = {
        name: sqlRes.name,
        guid: sqlRes.guid,
        cookbook_guid: sqlRes.cookbook_guid,
        creator_user_guid: sqlRes.creator_user_guid,
      }
      result.recipes.push(recipe)
    }
  }
  return result
}

const cleanTag = (tag: string) => tag.replace(/\s/g, '').replace(/&amp;/g, '&').toLowerCase()

export const transformParsedRecipe = (recipe: IRecipe) => {
  const {
    recipeIngredients,
    recipeInstructions,
    recipeCategories,
    recipeCuisines,
    keywords,
    description,
    cookbook_guid,
    name,
    image,
    base64Image,
    cookTime,
    prepTime,
    totalTime,
    recipeYield,
    url,
    source_type,
    is_private,
  } = recipe
  const tags = [
    ...(recipeCategories ? recipeCategories : []),
    ...(recipeCuisines ? recipeCuisines : []),
    ...(!recipeCategories && !recipeCuisines && keywords ? keywords : []),
  ]
  const cleanedTags = tags.map(t => cleanTag(t))

  return {
    cookbook_guid,
    name,
    image: image || null,
    base64Image: base64Image || null,
    description: description || null,
    cook_time: cookTime || null,
    prep_time: prepTime || null,
    total_time: totalTime || null,
    recipeYield: recipeYield || null,
    source_url: url,
    source_type,
    is_private,
    ingredients: JSON.stringify(recipeIngredients),
    instructions: JSON.stringify(recipeInstructions),
    tags: cleanedTags,
  }
}
