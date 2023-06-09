import React from 'react'
import styled from 'styled-components'

const NotFound = () => {
  return (
    <Style className='page-wrapper'>
      <h1>404</h1>
      <p>Sorry, this page does not exist :(</p>
    </Style>
  )
}

const Style = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  h1 {
    font-family: Montserrat, sans-serif;
    font-size: 6rem;
  }
`

export default NotFound
