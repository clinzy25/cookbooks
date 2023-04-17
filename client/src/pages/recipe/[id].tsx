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
  const {
    name,
    creator_user_email,
    image,
    description,
    cook_time,
    prep_time,
    total_time,
    yield: recipeYield,
    ingredients,
    instructions,
    tags,
    source_url,
    created_at,
  } = props.recipe
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
      <h1>{name}</h1>
      <div id='tags'>{tags?.split(',').map(t => (
        <span key={t}>#{t}</span>
      ))}</div>
      <p>Uploaded by {creator_user_email}</p>
      <div className='img-ctr'>
        {image && <Image className='img' src={image} alt={name} fill />}
      </div>
      <div>
        <span>Cook time: {cook_time} </span>
        <span>Prep time: {prep_time} </span>
        <span>Total time: {total_time} </span>
        <span>Servings: {recipeYield}</span>
      </div>
      <p>{source_url}</p>
      <p>Created at: {created_at}</p>
      <p>{description}</p>
      <div id='ingredients'>
        <h2>Ingredients</h2>
        {ingredients.map(ingredient => (
          <p key={ingredient}>{ingredient}</p>
        ))}
      </div>
      <div id='instructions'>
        <h2>Instructions</h2>
        {instructions.map((step, i) => (
          <p key={step}>{`${i + 1}. ${step}`}</p>
        ))}
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
