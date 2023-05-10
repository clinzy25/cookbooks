import styled from 'styled-components'
import Search from './Search'
import { FC } from 'react'
import TagList from './TagList'

const Navbar: FC = () => (
  <Style>
    <Search />
    <TagList />
  </Style>
)

const Style = styled.div`
  height: 65px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  z-index: 10;
  background-color: white;
  top: 0;
  width: 100%;
  gap: 12px;
  border-bottom: 1px solid gray;
  padding: 12px;
  box-shadow: 3px 3px 5px #e3e3e3;
  button {
    padding: 10px 20px;
    width: min-content;
    white-space: nowrap;
    border: 1px solid gray;
    border-radius: 10px;
    margin-left: 10px;
  }
`

export default Navbar
