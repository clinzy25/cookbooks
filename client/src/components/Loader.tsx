import React, { FC } from 'react'
import styled from 'styled-components'

type Props = {
  size: number
  fillSpace?: boolean
}

const Loader: FC<Props> = ({ size, fillSpace }) => (
  <Style className={fillSpace ? 'page-wrapper' : ''} fillSpace={fillSpace} size={size}>
    <div className='loader' />
  </Style>
)

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
  .loader {
    width: ${props => `${props.size}px`};
    height: ${props => `${props.size}px`};
    border: 3px solid #000;
    border-radius: 50%;
    display: inline-block;
    position: relative;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    ::after {
      content: '';
      box-sizing: border-box;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: ${props => `${props.size}px`};
      height: ${props => `${props.size}px`};
      border-radius: 50%;
      border: 3px solid transparent;
      border-bottom-color: #ff3d00;
    }
    @keyframes rotation {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
`

export default Loader
