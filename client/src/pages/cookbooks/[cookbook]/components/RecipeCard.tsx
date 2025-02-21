import { AvatarMixin, CardFontMixin, CardMixin, TagMixin } from '@/styles/mixins'
import { IRecipeRes } from '@/types/@types.recipes'
import { useUser } from '@auth0/nextjs-auth0/client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import styled from 'styled-components'

const RecipeCard: React.FC<IRecipeRes> = recipe => {
  const {
    query: { cookbook, cookbook_name },
  } = useRouter()
  const { user } = useUser()
  const {
    name,
    image,
    base64_image,
    cook_time,
    prep_time,
    tags,
    guid,
    creator_user_email,
    creator_user_guid,
    total_time,
  } = recipe

  const handleHref = () => {
    const c_name = encodeURIComponent(cookbook_name?.toString() as string)
    const recipe_name = encodeURIComponent(name)
    const owner = user?.sub === creator_user_guid ? 1 : 0
    return cookbook
      ? `/cookbooks/${cookbook}/recipe/${guid}?cookbook_name=${c_name}&recipe_name=${recipe_name}&owner=${owner}`
      : `/recipe/${guid}?recipe_name=${recipe_name}&owner=${owner}`
  }

  return (
    <Style as='article'>
      <Link href={handleHref()}>
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
              unoptimized
            />
          )}
        </div>
        <div className='text-ctr'>
          <div>
            <h3>{name?.toUpperCase()}</h3>
            <div className='tags-ctr'>
              {tags?.split(',').map((tag: string) => (
                <span className='tag' key={tag}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          <div className='meta-ctr'>
            <div>
              {cook_time && <p>Cook Time: {cook_time}</p>}
              {prep_time && <p>Prep Time: {prep_time}</p>}
              {!prep_time && !cook_time && total_time && <p>Total Time: {total_time}</p>}
            </div>
            <div className='uploader-ctr'>
              <div>
                <p>Uploaded by</p>
                <p>{creator_user_email}</p>
              </div>
              <Image
                src={user?.picture ? user.picture : '/assets/avatar-placeholder.png'}
                className='avatar'
                width={40}
                height={40}
                alt={user?.email || 'Avatar'}
              />
            </div>
          </div>
        </div>
      </Link>
    </Style>
  )
}

const Style = styled.article`
  ${CardMixin}
  &:hover {
    .img-ctr {
      .img {
        transition: ${({ theme }) => theme.cardTransition};
        transform: scale(1.03);
        filter: brightness(105%);
      }
    }
  }
  a {
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
      transition: ${({ theme }) => theme.cardTransition};
      object-fit: cover;
    }
  }
  .text-ctr {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 150px;
    gap: 5px;
    padding: 6px;
    h3 {
      ${CardFontMixin}
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      word-wrap: break-word;
      margin-bottom: 5px;
      font-size: 1.35rem;
    }
    .tags-ctr {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      overflow: hidden;
      padding-bottom: 5px;
      -webkit-line-clamp: 2;
      .tag {
        ${TagMixin}
        font-size: 0.9rem;
        margin: 0 0px 0 0;
        padding: 1px 5px;
        width: min-content;
      }
    }
    .meta-ctr {
      display: flex;
      align-items: flex-end;
      height: min-content;
      justify-content: space-between;
      font-size: 0.85rem;
      color: ${({ theme }) => theme.secondaryTextColor};
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
