export interface ISearchResult {
  name: string
  guid: string
  cookbook_guid: string
  creator_user_guid: string
}

export interface ISearchResults {
  recipes: ISearchResult[]
  tags: ISearchResult[]
}
