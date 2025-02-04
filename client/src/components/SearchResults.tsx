import { api, fetcher } from '@/api'
import RecipeCard from '@/pages/cookbooks/[cookbook]/components/RecipeCard'
import { IRecipeRes } from '@/types/@types.recipes'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'
import Loader from './Loader'
import Error from './Error'
import Head from 'next/head'
import { PageHeaderMixin, RecipeCardGridMixin } from '@/styles/mixins'

type Props = {
  recipes?: IRecipeRes[]
}

const SearchResults: FC<Props> = props => {
  const {
    query: { value, cookbook },
  } = useRouter()
  const { user } = useUser()
  const [recipes, setRecipes] = useState(props.recipes || [])
  const getSearchParams = () =>
    cookbook ? `cookbook_guid=${cookbook}` : `user_guid=${user?.sub}`

  const { data, error } = useSWR(
    `${api}/search/recipes/tag?tag_name=${value}&${getSearchParams()}`,
    fetcher
  )

  useEffect(() => {
    data && setRecipes(data)
  }, [data])

  if (!data && !recipes) {
    return <Loader size={50} fillSpace />
  }
  if (error) {
    return <Error fillSpace />
  }
  return (
    <Style as='main' className='page-wrapper'>
      <Head>
        <title>Cookbooks - #{value}</title>
      </Head>
      <header>
        <h1>#{value}</h1>
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
  ${PageHeaderMixin}
  header {
    margin-bottom: 15px;
  }
  #recipe-ctr {
    ${RecipeCardGridMixin}
  }
`

export default SearchResults
