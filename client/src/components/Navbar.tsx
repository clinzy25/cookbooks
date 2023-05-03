import styled from 'styled-components'
import Search from './Search'
import { FC, useState } from 'react'
import { NAVBAR_HEIGHT } from '@/utils/utils.constants'
import TagList from './TagList'

const Navbar: FC = () => {
  const [showSearch, setShowSearch] = useState(false)
  return (
    <Style navbarHeight={NAVBAR_HEIGHT}>
      <Search showSearch={showSearch} setShowSearch={setShowSearch} />
      {!showSearch && <TagList />}
    </Style>
  )
}

type StyleProps = {
  navbarHeight: number
}

const Style = styled.div<StyleProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  height: ${props => `${props.navbarHeight}px`};
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
