import { api, fetcher } from '@/api'
import { IRecipe } from '@/types/@types.recipes'
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'

type Props = {
  recipe: IRecipe
}

const RecipePage: React.FC<Props> = (props: Props) => {
  const { name, image } = props.recipe
  const {
    query: { id },
  } = useRouter()
  const [recipe, setRecipe] = useState<IRecipe>(props.recipe)
  const { data, error } = useSWR<IRecipe, Error>(`${api}/recipes?recipe_guid=${id}`, fetcher)

  useEffect(() => {
    data && setRecipe(data)
  }, [data])

  if (!data && !recipe) {
    return <p>loading...</p>
  }
  if (error) {
    return <p>error</p>
  }
  return (
    <Style>
      <h1>{recipe_name}</h1>
      <div className='img-ctr'>
        {image && <Image className='img' src={image} alt={recipe_name} fill />}
      </div>
    </Style>
  )
}

export async function getServerSideProps(context: {
  params: { id: string }
}): Promise<{ props: Props }> {
  const id = context.params.id
  const recipe: IRecipe = await fetcher(`${api}/recipes?recipe_guid=${id}`)
  return { props: { recipe } }
}

const Style = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  .img-ctr {
    position: relative;
    width: 500px;
    height: 400px;
    overflow: hidden;
    .img {
      object-fit: cover;
    }
  }
`

export default withPageAuthRequired(RecipePage)
