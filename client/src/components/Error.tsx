import React, { FC } from 'react'
import styled from 'styled-components'

type Props = {
  fillSpace?: boolean
  fontSize?: number
}

const Error: FC<Props> = ({ fillSpace, fontSize = 1.5 }) => {
  return (
    <Style
      className={fillSpace ? 'page-wrapper' : ''}
      fillSpace={fillSpace}
      fontSize={fontSize}>
      Something went wrong :(
    </Style>
  )
}

const Style = styled.div<Props>`
  ${props =>
    props.fillSpace &&
    `
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%
  `};
  font-size: ${props => props.fontSize}rem;
  font: ${({ theme }) => theme.modalHeaderFont};
`

export default Error
