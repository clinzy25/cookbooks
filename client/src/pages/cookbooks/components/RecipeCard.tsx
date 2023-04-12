import { IRecipe } from '@/types/@types.recipes'
import Image from 'next/image'
import React from 'react'
import styled from 'styled-components'

const RecipeCard: React.FC<IRecipe> = recipe => {
  const { recipe_name, image, cook_time, prep_time, tags } = recipe
  return (
    <Style>
      {image && (
        <Image src={image} alt={recipe_name} width={300} height={300} />
      )}
      <p>{recipe_name}</p>
      <span>Cook Time: {cook_time}</span>
      <span>Prep Time: {prep_time}</span>
      <p className='tags-ctr'>
        {tags.split(',').map((tag: string) => (
          <span key={tag}>#{tag} </span>
        ))}
      </p>
    </Style>
  )
}

const Style = styled.article``

export default RecipeCard
