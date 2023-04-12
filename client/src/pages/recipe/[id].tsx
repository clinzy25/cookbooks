import { api, fetcher } from '@/api'
import { IRecipe } from '@/types/@types.recipes'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'

type Props = {
  recipe: IRecipe
}

const RecipePage: React.FC<Props> = (props: Props) => {
  const { recipe_name } = props.recipe

  const {
    query: { id },
  } = useRouter()
  const [recipe, setRecipe] = useState<IRecipe>(props.recipe)
  const { data, error } = useSWR<IRecipe, Error>(
    `${api}/recipes?recipe_guid=${id}`,
    fetcher
  )

  useEffect(() => {
    data && setRecipe(data)
  }, [data])

  if (!data && !recipe) {
    return <p>loading...</p>
  }
  if (error) {
    return <p>error</p>
  }
  return <p>{recipe_name}</p>
}

export async function getServerSideProps(context: {
  params: { id: string }
}): Promise<{ props: Props }> {
  const id = context.params.id
  const recipe: IRecipe = await fetcher(`${api}/recipes?recipe_guid=${id}`)
  return { props: { recipe } }
}

export default RecipePage
