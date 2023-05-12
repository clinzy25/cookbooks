import styled from 'styled-components'
import Search from './Search'
import { FC, useState } from 'react'
import TagList from './TagList'
import { FaUserCircle } from 'react-icons/fa'
import { IconMixin } from '@/styles/mixins'

const Navbar: FC = () => {
  const [dropdown, setDropdown] = useState(false)
  return (
    <Style id='navbar'>
      <Search />
      <TagList />
      <FaUserCircle id='user-btn' onClick={() => setDropdown(!dropdown)} />
      {dropdown && (
        <div id='dropdown'>
          <ul>
            <li>
              <a href='/api/auth/logout'>Logout</a>
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
  }
  #dropdown {
    position: absolute;
    z-index: 3;
    right: 20px;
    top: 50px;
    background-color: ${({ theme }) => theme.secondaryBackgroundColor};
    border-radius: 10px;
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
