import { AvatarMixin, CardGradient, CardGradientHover } from '@/styles/mixins'
import { ICookbookRes } from '@/types/@types.cookbooks'
import randomInRange from '@/utils/utils.randomInRange'
import { useUser } from '@auth0/nextjs-auth0/client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { FaCrown } from 'react-icons/fa'
import styled from 'styled-components'

type Props = {
  cookbook: ICookbookRes
}

const CookbookCard = ({ cookbook }: Props) => {
  const { user } = useUser()
  const {
    guid,
    cookbook_name,
    recipe_images,
    creator_username,
    creator_user_guid,
    cookbook_members,
    recipe_count,
  } = cookbook
  const [randomInt] = useState(randomInRange(1, 3))

  const handleHref = () => {
    const c_name = encodeURIComponent(cookbook_name)
    const owner = user?.sub === creator_user_guid ? 1 : 0
    return `/cookbooks/${guid}?cookbook_name=${c_name}&owner=${owner}`
  }

  return (
    <Style>
      <Link className='cookbook-tile' href={handleHref()}>
        <div className='img-ctr'>
          {recipe_images?.length ? (
            recipe_images?.map(image => (
              <div key={image} className='ctr'>
                <Image
                  className='img'
                  src={image}
                  alt='Recipe'
                  fill
                  priority
                  sizes={recipe_images.length > 3 ? '300px' : '800px'}
                />
              </div>
            ))
          ) : (
            <div className='ctr'>
              <Image
                className='img'
                src={`${process.env.NEXT_PUBLIC_RECIPE_IMAGES_BUCKET_LINK}/recipe_fallback_${randomInt}.png`}
                alt={cookbook_name}
                fill
                priority
                sizes={recipe_images.length > 3 ? '300px' : '800px'}
              />
            </div>
          )}
        </div>
        <div className='meta-ctr'>
          <h2>{cookbook_name}</h2>
          <p>{recipe_count} Recipes</p>
          <div>
            <FaCrown className='crown-icon' />
            <Image
              src={user?.picture ? user.picture : '/assets/avatar-placeholder.png'}
              className='avatar'
              width={40}
              height={40}
              alt={`${creator_username} (owner)`}
              title={`${creator_username} (owner)`}
            />

            {cookbook_members.length > 0 &&
              cookbook_members.map(m => (
                <Image
                  key={m.guid}
                  src={m?.picture ? m.picture : '/assets/avatar-placeholder.png'}
                  className='avatar'
                  width={40}
                  height={40}
                  alt={user?.email || 'Avatar'}
                />
              ))}
          </div>
        </div>
      </Link>
    </Style>
  )
}

const Style = styled.div`
  border-radius: 10px;
  box-shadow: 2px 2px 5px ${({ theme }) => theme.darkBoxShadowColor};
  transition: ${({ theme }) => theme.cardTransition};
  &:hover {
    transition: ${({ theme }) => theme.cardTransition};
    box-shadow: 4px 4px 7px ${({ theme }) => theme.darkBoxShadowColorHover};
    a {
      &::before {
        ${CardGradientHover}
      }
    }
  }
  a {
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;
    border-radius: inherit;
    &::before {
      content: '';
      ${CardGradient}
      height: 100%;
      border-radius: inherit;
      position: absolute;
      top: 0;
      width: 100%;
      z-index: 2;
    }
    .img-ctr {
      display: grid;
      gap: 4px;
      grid-template-rows: 1fr;
      grid-template-columns: repeat(auto-fit, minmax(125px, 1fr));
      width: 100%;
      height: 100%;
      border-radius: 10px;
    }
    .ctr {
      position: relative;
      overflow: hidden;
      border-radius: 10px;
      &:hover {
        .img {
          transform: scale(1.1);
        }
      }
      .img {
        object-fit: cover;
      }
    }
  }
  .meta-ctr {
    width: 100%;
    padding: 5px;
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 0;
    z-index: 3;
    h2 {
      font-family: ${({ theme }) => theme.headerFont};
    }
    p {
      margin-bottom: 12px;
    }
    div {
      position: relative;
      .crown-icon {
        position: absolute;
        top: -10px;
        left: 12px;
        color: #f0b132;
      }
    }
    .avatar {
      ${AvatarMixin}
      margin-right: 5px;
    }
  }
  @media screen and (max-width: ${({ theme }) => theme.breakpointMobile}px) {
    a {
      .img-ctr {
        grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
      }
    }
  }
`

export default CookbookCard
