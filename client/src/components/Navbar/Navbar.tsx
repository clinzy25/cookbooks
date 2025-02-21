import styled from 'styled-components'
import Search from './components/Search'
import { FC, useRef, useState } from 'react'
import TagList from './components/TagList'
import { AvatarMixin, DropdownAnimationMixin } from '@/styles/mixins'
import Link from 'next/link'
import { useOutsideAlerter } from '@/utils/utils.hooks'
import Image from 'next/image'
import { useUser } from '@auth0/nextjs-auth0/client'

const Navbar: FC = () => {
  const [dropdown, setDropdown] = useState(false)
  const dropdownRef = useRef(null)
  useOutsideAlerter(dropdownRef, () => setDropdown(false))
  const { user } = useUser()

  return (
    <Style as='nav' id='navbar'>
      <Search />
      <TagList />
      <Image
        src={user?.picture ? user.picture : '/assets/avatar-placeholder.png'}
        className='avatar'
        width={40}
        height={40}
        priority
        alt={user?.email || 'Avatar'}
        onClick={() => setDropdown(!dropdown)}
      />
      {dropdown && (
        <div ref={dropdownRef} id='dropdown'>
          <ul>
            <li>
              <Link href='/api/auth/logout'>Logout</Link>
            </li>
          </ul>
        </div>
      )}
    </Style>
  )
}

const Style = styled.nav`
  height: 65px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  z-index: 10;
  background-color: ${({ theme }) => theme.navBackgroundColor};
  top: 0;
  width: 100%;
  gap: 12px;
  padding: 12px;
  box-shadow: ${({ theme }) => theme.boxShadowOverOtherElements};
  .avatar {
    ${AvatarMixin}
    cursor: pointer;
    height: 40px;
    width: 40px;
  }
  #dropdown {
    position: absolute;
    z-index: 3;
    right: 20px;
    top: 50px;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.mainBackgroundColor};
    border: 0.5px solid ${({ theme }) => theme.softBorder};
    ${DropdownAnimationMixin}
    ul {
      li {
        padding: 10px;
        list-style: none;
        border-radius: 10px;
        &:hover {
          background-color: ${({ theme }) => theme.mainBackgroundColorHover};
        }
      }
    }
  }
`

export default Navbar
