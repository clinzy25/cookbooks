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
        cookbook_guid: sqlRes.cookbook_guid
      }
      result.recipes.push(recipe)
    }
  }
  return result
}

export const transformParsedRecipe = (recipe: IRecipe) => {
  const {
    description,
    recipeIngredients,
    recipeInstructions,
    recipeCategories,
    recipeCuisines,
  } = recipe
  return {
    ...recipe,
    description: description.replace(/'/g, '&apos;'),
    recipeIngredients: JSON.stringify(recipeIngredients).replace(/'/g, '&apos;'),
    recipeInstructions: JSON.stringify(recipeInstructions).replace(/'/g, '&apos;'),
    tags: recipeCategories.concat(recipeCuisines),
  }
}
