import { AvatarMixin, TagMixin } from '@/styles/mixins'
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
  const { name, image, base64_image, cook_time, prep_time, tags, guid, creator_user_email } =
    recipe

  return (
    <Style>
      <Link href={`/cookbooks/${cookbook}/recipe/${guid}`}>
        <div className='img-ctr'>
          {image && (
            <Image
              className='img'
              src={image}
              alt={name}
              fill
              priority
              placeholder='blur'
              blurDataURL={base64_image}
              sizes='(max-width: 800px) 100vw, 303px'
            />
          )}
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
  transition: 0.03s;
  border-radius: 10px;
  box-shadow: 2px 2px 5px #b7b7b7;
  &:not(.tag) {
    letter-spacing: 0.5px;
  }
  &:hover {
    transition: 0.03s;
    background-color: #f0f0f0;
    box-shadow: 4px 4px 7px #a6a6a6;
    .img-ctr {
      .img {
        transition: 0.03s ease-out;
        transform: scale(1.01);
        filter: brightness(105%);
      }
    }
  }
  a {
    padding: 8px;
    display: inline-block;
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
      transition: 0.03s ease-in;
      object-fit: cover;
    }
  }
  .text-ctr {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 150px;
    gap: 5px;
    h3 {
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      word-wrap: break-word;
      margin-bottom: 5px;
      font-size: 1.3rem;
    }
    .tags-ctr {
      display: flex;
      flex-wrap: wrap;
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
        text-align: right;
        .avatar {
          ${AvatarMixin}
          margin-left: 5px;
        }
      }
    }
  }
`

export default RecipeCard
