import { api, fetcher } from '@/api'
import { IRecipe } from '@/types/@types.recipes'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'
import RecipeCard from './components/RecipeCard'
import { ICookbook } from '@/types/@types.cookbooks'
import useAppContext from '@/context/app.context'
import { AppContextType } from '@/types/@types.context'

type Props = {
  recipes: IRecipe[]
}

const CookbookDetailPage: React.FC<Props> = (props: Props) => {
  const {
    query: { id },
  } = useRouter()
  const { cookbooks } = useAppContext() as AppContextType
  const [recipes, setRecipes] = useState<IRecipe[]>(props.recipes)
  const [cookbook, setCookbook] = useState<ICookbook | undefined>()
  const { data, error } = useSWR<IRecipe[], Error>(
    `${api}/recipes/cookbook?cookbook=${id}`,
    fetcher
  )

  useEffect(() => {
    data && setRecipes(data)
  }, [data])

  useEffect(() => {
    setCookbook(cookbooks.find((cb: ICookbook) => cb.guid === id))
  }, [cookbooks, setCookbook, id])

  if (!data && !recipes) {
    return <p>loading...</p>
  }
  if (error) {
    return <p>error</p>
  }
  return (
    <Styled>
      <h1>{cookbook?.cookbook_name}</h1>
      <div id='recipe-ctr'>
        {recipes.map((recipe: IRecipe) => (
          <RecipeCard {...recipe} key={recipe.guid} />
        ))}
      </div>
    </Styled>
  )
}

export async function getServerSideProps(context: {
  params: { id: string }
}): Promise<{ props: Props }> {
  const id = context.params.id
  const recipes: IRecipe[] = await fetcher(
    `${api}/recipes/cookbook?cookbook=${id}`
  )
  return { props: { recipes } }
}

const Styled = styled.main`
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

export default CookbookDetailPage
