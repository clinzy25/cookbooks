import { AvatarMixin, CardGradient, CardGradientHover } from '@/styles/mixins'
import { ICookbookRes } from '@/types/@types.cookbooks'
import { BREAKPOINT_MOBILE } from '@/utils/utils.constants'
import randomInRange from '@/utils/utils.randomInRange'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { FaCrown } from 'react-icons/fa'
import styled from 'styled-components'

type Props = {
  cookbook: ICookbookRes
}

const CookbookCard = ({ cookbook }: Props) => {
  const {
    guid,
    cookbook_name,
    recipe_images,
    creator_username,
    cookbook_members,
    recipe_count,
  } = cookbook
  const [randomInt] = useState(randomInRange(1, 3))

  return (
    <Style BREAKPOINT_MOBILE={BREAKPOINT_MOBILE}>
      <Link className='cookbook-tile' href={`/cookbooks/${guid}`}>
        <div className='img-ctr'>
          {recipe_images.length ? (
            recipe_images.map(image => (
              <div key={image} className='ctr'>
                <Image className='img' src={image} alt={image} fill />
              </div>
            ))
          ) : (
            <div className='ctr'>
              <Image
                className='img'
                src={`${process.env.NEXT_PUBLIC_RECIPE_IMAGES_BUCKET_LINK}/recipe_fallback_${randomInt}.png`}
                alt={cookbook_name}
                fill
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
              src='/assets/avatar-placeholder.png'
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
                  src='/assets/avatar-placeholder.png'
                  className='avatar'
                  width={40}
                  height={40}
                  alt={`${m.username} (member)`}
                  title={`${m.username} (member)`}
                />
              ))}
          </div>
        </div>
      </Link>
    </Style>
  )
}

type StyleProps = {
  BREAKPOINT_MOBILE: number
}

const Style = styled.div<StyleProps>`
  border-radius: 10px;
  height: 100%;
  box-shadow: 4px 4px 8px #b7b7b7;
  transition: 0.03s;
  &:hover {
    transition: 0.03s;
    box-shadow: 5px 5px 10px #a6a6a6;
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
    p {
      margin-bottom: 12px;
    }
    div {
      position: relative;
      .crown-icon {
        position: absolute;
        top: -10px;
        left: 17px;
        color: #f0b132;
      }
    }
    .avatar {
      ${AvatarMixin}
      margin-right: 5px;
    }
  }
  @media screen and (max-width: ${props => props.BREAKPOINT_MOBILE}px) {
    a {
      .img-ctr {
        grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
      }
    }
  }
`

export default CookbookCard
