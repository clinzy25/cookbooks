import { IHttpSearchResult, ISearchResult } from '../types/@types.search'
import { IMemberResult, IHttpMemberResults } from '../types/@types.users'

export const transformMembers = (sqlResult: IMemberResult[]): IHttpMemberResults => {
  const result: IHttpMemberResults = {
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

export const splitTagsAndSearchResults = (sqlResult: ISearchResult[]) => {
  const result: IHttpSearchResult = {
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
      }
      result.recipes.push(recipe)
    }
  }
  return result
}
