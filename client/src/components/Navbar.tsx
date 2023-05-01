import Link from 'next/link'
import styled from 'styled-components'
import Search from './Search'
import Image from 'next/image'
import { FC } from 'react'
import { NAVBAR_HEIGHT } from '@/utils/utils.constants'
import TagList from './TagList'

const Navbar: FC = () => (
  <Style navbarHeight={NAVBAR_HEIGHT}>
    <div id='input-ctr'>
      <Link href='/cookbooks'>
        <Image
          src='/../public/assets/avatar-placeholder.png'
          width={49}
          height={49}
          alt='Home'
        />
      </Link>
      <Search />
    </div>
    <TagList />
    <a href='/api/auth/logout'>
      <button>Logout</button>
    </a>
  </Style>
)

type StyleProps = {
  navbarHeight: number
}

const Style = styled.div<StyleProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${props => `${props.navbarHeight}px`};
  border-bottom: 1px solid gray;
  padding: 12px;
  box-shadow: 3px 3px 5px #e3e3e3;
  #input-ctr {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    white-space: nowrap;
    height: 100%;
  }
  button {
    padding: 10px 20px;
    width: min-content;
    white-space: nowrap;
    border: 1px solid gray;
    border-radius: 10px;
    margin-left: 10px;
  }
  @media screen and (max-width: 800px) {
    #tag-list {
      width: 100%;
    }
  }
`

export default Navbar
