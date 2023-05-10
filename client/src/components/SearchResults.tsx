import { api, fetcher } from '@/api'
import RecipeCard from '@/pages/cookbooks/[cookbook]/components/RecipeCard'
import { IRecipeRes } from '@/types/@types.recipes'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'

const SearchResults: FC = () => {
  const {
    query: { tag, cookbook },
  } = useRouter()
  const { user } = useUser()
  const [recipes, setRecipes] = useState([])

  const getSearchParams = () =>
    cookbook ? `cookbook_guid=${cookbook}` : `user_guid=${user?.sub}`

  const { data, error } = useSWR(
    `${api}/search/recipes/tag?tag_name=${tag}&${getSearchParams()}`,
    fetcher
  )
  useEffect(() => {
    data && setRecipes(data)
  }, [data])

  if (!data) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>Error...</p>
  }
  return (
    <Style>
      <header>
        <h1>#{tag}</h1>
      </header>
      <div id='recipe-ctr'>
        {recipes?.map((recipe: IRecipeRes) => (
          <RecipeCard {...recipe} key={recipe.guid} />
        ))}
      </div>
    </Style>
  )
}

const Style = styled.main`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  header {
    margin-bottom: 15px;
  }
  #recipe-ctr {
    display: grid;
    width: 100%;
    gap: 20px;
    grid-template-rows: repeat(1fr);
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
`

export default SearchResults
