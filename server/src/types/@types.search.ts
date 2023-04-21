export interface ISearchResult {
  name: string
  guid: string
}

export interface IHttpSearchResult {
  recipes: ISearchResult[]
  tags: ISearchResult[]
}
