import React from 'react'
import styled from 'styled-components'
// import { handleLogout } from '@auth0/nextjs-auth0'

const Navbar = () => (
  <Style>
    <p>Cookbooks App</p>
    <a href='/api/auth/logout'>
      <button>Logout</button>
    </a>
  </Style>
)

const Style = styled.div`
  display: flex;
  justify-content: space-between;
  height: 75px;
`

export default Navbar
