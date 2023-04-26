import { api, fetcher } from '@/api'
import useAppContext from '@/context/app.context'
import RecipeCard from '@/pages/cookbooks/components/RecipeCard'
import { IAppContext } from '@/types/@types.context'
import { IRecipeRes } from '@/types/@types.recipes'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'

const SearchResultsRecipes: FC = () => {
  const {
    query: { id },
  } = useRouter()
  const { user } = useUser()
  const { currentCookbook } = useAppContext() as IAppContext
  const [recipes, setRecipes] = useState([])

  const getSearchParams = () =>
    currentCookbook ? `cookbook_guid=${currentCookbook?.guid}` : `user_guid=${user?.sub}`

  const { data, error } = useSWR(
    `${api}/search/recipes/tag?tag_name=${id}&${getSearchParams()}`,
    fetcher
  )

  useEffect(() => {
    data?.data && setRecipes(data.data)
  }, [data])

  if (!data) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>Error...</p>
  }
  return (
    <Style>
      <h1>#{id}</h1>
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
  align-items: center;
  #recipe-ctr {
    display: grid;
    width: 100%;
    gap: 20px;
    grid-template-rows: repeat(1fr);
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
`

export default SearchResultsRecipes
