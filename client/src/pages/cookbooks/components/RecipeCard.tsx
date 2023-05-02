import { IRecipeRes } from '@/types/@types.recipes'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import styled from 'styled-components'

const RecipeCard: React.FC<IRecipeRes> = recipe => {
  const {
    query: { cookbook },
  } = useRouter()
  const { name, image, cook_time, prep_time, tags, guid } = recipe
  return (
    <Style>
      <Link href={`${cookbook}/recipe/${guid}`}>
        <div className='img-ctr'>
          {image && <Image className='img' src={image} alt={name} fill />}
        </div>
        <p>{name}</p>
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
