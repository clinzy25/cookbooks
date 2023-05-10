import React, { FC } from 'react'
import styled from 'styled-components'
import { ISnackbar } from '@/types/@types.context'
import { SNACKBAR_DURATION_MS } from '@/utils/utils.constants'

type Props = {
  snackbar: ISnackbar
}

const Snackbar: FC<Props> = ({ snackbar }) => (
  <Style duration={SNACKBAR_DURATION_MS} state={snackbar.state}>
    {snackbar.msg}
  </Style>
)

type StyleProps = {
  state: string
  duration: number
}

const Style = styled.div<StyleProps>`
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
    switch (props.state) {
      case 'success':
        return `${props.theme.successColor};`
      case 'error':
        return `${props.theme.errorColor};`
      default:
        return `${props.theme.neutralColor};`
    }
  }};
  animation: ${props => `snackbarIn ${props.duration}ms ease-out`};
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
