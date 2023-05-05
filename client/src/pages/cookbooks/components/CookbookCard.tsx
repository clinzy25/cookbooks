import { AvatarMixin } from '@/styles/mixins'
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
  const { guid, cookbook_name, recipe_images, creator_username, cookbook_members } = cookbook
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
        <h3>{cookbook_name}</h3>
        <div className='meta-ctr'>
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
      </Link>
    </Style>
  )
}

type StyleProps = {
  BREAKPOINT_MOBILE: number
}

const Style = styled.div<StyleProps>`
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.softBorder};
  height: 100%;
  min-height: 400px;
  a {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    .img-ctr {
      display: grid;
      gap: 4px;
      grid-template-rows: 1fr;
      grid-template-columns: repeat(auto-fit, minmax(125px, 1fr));
      width: 100%;
      height: 80%;
      .ctr {
        position: relative;
        overflow: hidden;
        border-radius: 10px;

        .img {
          object-fit: cover;
        }
      }
    }
    .meta-ctr {
      position: relative;
      .crown-icon {
        position: absolute;
        top: -10px;
        left: 17px;
        color: #f0b132;
      }
      .avatar {
        ${AvatarMixin}
      }
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
