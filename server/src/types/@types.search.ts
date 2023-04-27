export interface ISearchResult {
  name: string
  guid: string
}

export interface ISearchResults {
  recipes: ISearchResult[]
  tags: ISearchResult[]
}
