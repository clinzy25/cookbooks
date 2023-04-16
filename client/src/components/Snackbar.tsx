import React from 'react'
import styled from 'styled-components'
import { SnackbarType } from '@/types/@types.context'

type Props = {
  snackbar: SnackbarType
}

const Snackbar = ({ snackbar }: Props) => <Style snackbar={snackbar}>{snackbar.msg}</Style>

const Style = styled.div<Props>`
  position: fixed;
  width: min-content;
  white-space: nowrap;
  bottom: 90px;
  left: 0;
  right: 0;
  margin: auto;
  padding: 6px 50px;
  border-radius: 5px;
  box-shadow: 5px 5px 10px #00000055;
  border: 1px solid gray;
  z-index: 3;
  color: white;
  background-color: ${props => {
    switch (props.snackbar.state) {
      case 'success':
        return '#16a500'
      case 'error':
        return '#d80000'
      default:
        return '#bababa'
    }
  }};
  animation: ${props => `snackbarIn ${props.snackbar.duration}ms ease-out`};
  @keyframes snackbarIn {
    0% {
      transform: translateY(200px);
      opacity: 0;
    }
    10% {
      transform: translateY(0);
      opacity: 1;
    }
    90% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(200px);
      opacity: 0;
    }
  }
`

export default Snackbar
