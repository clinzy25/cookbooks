import { api, fetcher } from '@/api'
import { IRecipe } from '@/types/@types.recipes'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'

type Props = {
  recipes: IRecipe[]
}

const CookbooksDetailPage: React.FC<Props> = (props: Props) => {
  const {
    query: { id },
  } = useRouter()
  const [recipes, setRecipes] = useState<IRecipe[]>(props.recipes)
  const { data, error } = useSWR<IRecipe[], Error>(
    `${api}/recipes?cookbook=${id}`,
    fetcher
  )

  useEffect(() => {
    data && setRecipes(data)
  }, [data])

  if (!data && !recipes) {
    return <p>loading...</p>
  }
  if (error) {
    return <p>error</p>
  }
  return (
    <Styled>
      {recipes.map(r => (
        <p key={r.guid}>{r.recipe_name}</p>
      ))}
    </Styled>
  )
}

export async function getServerSideProps(context: {
  params: { id: string }
}): Promise<{ props: Props }> {
  const id = context.params.id
  const recipes: IRecipe[] = await fetcher(`${api}/recipes?cookbook=${id}`)
  return { props: { recipes } }
}

const Styled = styled.main``

export default CookbooksDetailPage
