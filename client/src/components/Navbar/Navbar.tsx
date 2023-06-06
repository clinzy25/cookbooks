import styled from 'styled-components'
import Search from './components/Search'
import { FC, useRef, useState } from 'react'
import TagList from './components/TagList'
import { FaUserCircle } from 'react-icons/fa'
import { DropdownAnimationMixin, IconMixin } from '@/styles/mixins'
import Link from 'next/link'
import { useOutsideAlerter } from '@/utils/utils.hooks'

const Navbar: FC = () => {
  const [dropdown, setDropdown] = useState(false)
  const dropdownRef = useRef(null)
  useOutsideAlerter(dropdownRef, () => setDropdown(false))

  return (
    <Style id='navbar'>
      <Search />
      <TagList />
      <FaUserCircle id='user-btn' onClick={() => setDropdown(!dropdown)} />
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
  background-color: ${({ theme }) => theme.mainBackgroundColor};
  top: 0;
  width: 100%;
  gap: 12px;
  padding: 12px;
  box-shadow: ${({ theme }) => theme.boxShadowOverOtherElements};
  #user-btn {
    ${IconMixin}
    padding: 0;
    color: #f1c410;
    min-width: 35px;
  }
  #dropdown {
    position: absolute;
    z-index: 3;
    right: 20px;
    top: 50px;
    background-color: ${({ theme }) => theme.secondaryBackgroundColor};
    border-radius: 10px;
    ${DropdownAnimationMixin}
    ul {
      li {
        padding: 10px;
        list-style: none;
        border-radius: 10px;
        &:hover {
          background-color: ${({ theme }) => theme.secondaryBackgroundColorHover};
        }
      }
    }
  }
`

export default Navbar
