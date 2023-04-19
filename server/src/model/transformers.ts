import { ITagResult } from '../types/@types.tags'
import { IMemberResult, IHttpMemberResults } from '../types/@types.users'

export const transformTags = (sqlResult: ITagResult[]) =>
  sqlResult.map((result: ITagResult) => Object.values(result)[0])

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
