export interface ISearchResult {
  name: string
  guid: string
}

export interface SearchResults {
  recipes: ISearchResult[]
  tags: ISearchResult[]
}
