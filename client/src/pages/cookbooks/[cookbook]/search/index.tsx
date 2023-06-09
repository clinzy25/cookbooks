import { api, fetcher } from '@/api'
import SearchResults from '@/components/SearchResults'
import { IRecipeRes } from '@/types/@types.recipes'
import React, { FC } from 'react'

type Props = {
  recipes: IRecipeRes[]
}

const SearchResultsRecipes: FC<Props> = props  => <SearchResults recipes={props.recipes} />

export async function getServerSideProps(context: {
  params: { cookbook: string; value: string }
}): Promise<{ props: Props } | { notFound: true }> {
  const cookbook = context.params.cookbook
  const value = context.params.value
  const recipes = await fetcher(
    `${api}/search/recipes/tag?tag_name=${value}&cookbook_guid=${cookbook}`
  )
  if (!recipes) {
    return {
      notFound: true,
    }
  }
  return { props: { recipes } }
}

export default SearchResultsRecipes
