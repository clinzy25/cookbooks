import { IRecipe } from '@/types/@types.recipes'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'

const RecipeCard: React.FC<IRecipe> = recipe => {
  const { recipe_name, image, cook_time, prep_time, tags, guid } = recipe
  return (
    <Style>
      <Link href={`/recipe/${guid}`}>
        <div className='img-ctr'>
          {image && (
            <Image className='img' src={image} alt={recipe_name} fill />
          )}
        </div>
        <p>{recipe_name}</p>
        <span>Cook Time: {cook_time}</span>&nbsp;
        <span>Prep Time: {prep_time}</span>
        <p className='tags-ctr'>
          {tags?.split(',').map((tag: string) => (
            <span key={tag}>#{tag} </span>
          ))}
        </p>
      </Link>
    </Style>
  )
}

const Style = styled.article`
  .img-ctr {
    position: relative;
    min-width: 200px;
    height: 300px;
    overflow: hidden;
    .img {
      object-fit: cover;
    }
  }
`

export default RecipeCard
