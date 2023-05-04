import { TagMixin } from '@/styles/mixins'
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
  const { name, image, cook_time, prep_time, tags, guid, creator_user_email } = recipe

  return (
    <Style>
      <Link href={`${cookbook}/recipe/${guid}`}>
        <div className='img-ctr'>
          {image && <Image className='img' src={image} alt={name} fill />}
        </div>
        <div className='text-ctr'>
          <div>
            <h3>{name}</h3>
            <div className='tags-ctr'>
              {tags?.split(',').map((tag: string) => (
                <span className='tag' key={tag}>
                  <span className='hash'>#</span>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className='meta-ctr'>
            <div>
              <p>Cook Time: {cook_time}</p>
              <p>Prep Time: {prep_time}</p>
            </div>
            <div className='uploader-ctr'>
              <div>
                <p>Uploaded by</p>
                <p>{creator_user_email}</p>
              </div>
              <Image
                src='/assets/avatar-placeholder.png'
                className='avatar'
                width={40}
                height={40}
                alt={'dfsadsfa'}
              />
            </div>
          </div>
        </div>
      </Link>
    </Style>
  )
}

const Style = styled.article`
  transition: 0.08s;
  border-radius: 10px;
  letter-spacing: 0.5px;
  &:hover {
    transition: 0.08s;
    background-color: #f0f0f0;
  }
  a {
    padding: 8px;
    display: inline-block;
    height: 100%;
    width: 100%;
  }
  .img-ctr {
    position: relative;
    min-width: 200px;
    height: 300px;
    overflow: hidden;
    border-radius: 10px;
    margin-bottom: 7px;
    .img {
      object-fit: cover;
    }
  }
  .text-ctr {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 120px;
    h3 {
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      word-wrap: break-word;
      margin-bottom: 5px;
    }
    .tags-ctr {
      display: flex;
      .tag {
        ${TagMixin}
        font-size: 0.8rem;
        margin: 0 5px 0 0;
        padding: 0 4px;
        &:hover {
          text-decoration: none;
        }
      }
      .hash {
        margin: 0 1px;
      }
    }
    .meta-ctr {
      height: min-content;
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      .uploader-ctr {
        display: flex;
        align-items: flex-end;
        white-space: nowrap;
        .avatar {
          border: 1px solid black;
          border-radius: 25px;
          padding: 3px;
          margin-left: 5px;
        }
      }
    }
  }
`

export default RecipeCard
