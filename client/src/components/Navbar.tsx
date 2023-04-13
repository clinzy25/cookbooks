import React from 'react'
import styled from 'styled-components'
// import { handleLogout } from '@auth0/nextjs-auth0'

const Navbar = () => {
  return (
    <Style>
      <a href='/api/auth/logout'>
        <button>Logout</button>
      </a>
    </Style>
  )
}

const Style = styled.div`
  width: 100vw;
  height: 75px;
`

export default Navbar
