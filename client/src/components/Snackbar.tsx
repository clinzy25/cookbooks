import React, { FC, useEffect } from 'react'
import styled from 'styled-components'
import { IAppContext, ISnackbar } from '@/types/@types.context'
import { SNACKBAR_DURATION_MS } from '@/utils/utils.constants'
import useAppContext from '@/context/app.context'

type Props = {
  snackbar: ISnackbar
}

const Snackbar: FC<Props> = ({ snackbar }) => {
  const { setSnackbar } = useAppContext() as IAppContext

  const handleReset = () => {
    if (snackbar.msg) {
      let timeout: ReturnType<typeof setTimeout>
      timeout = setTimeout(
        () => setSnackbar({ msg: '', state: '' }),
        SNACKBAR_DURATION_MS - 15
      )
      return () => timeout && clearTimeout(timeout)
    }
  }

  useEffect(() => {
    handleReset()
  }, [])

  return (
    <Style duration={SNACKBAR_DURATION_MS} state={snackbar.state}>
      {snackbar.msg}
    </Style>
  )
}

type StyleProps = {
  state: string
  duration: number
}

const Style = styled.div<StyleProps>`
  position: fixed;
  width: min-content;
  white-space: nowrap;
  top: 90px;
  left: 0;
  right: 0;
  margin: auto;
  padding: 6px 50px;
  border-radius: 5px;
  box-shadow: ${({ theme }) => theme.boxShadowOverOtherElements};
  border: 1px solid gray;
  z-index: 11;
  color: ${({ theme }) => theme.mainTextColor};
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
  animation: ${props => `snackbarIn ${props.duration}ms`};
  @keyframes snackbarIn {
    0% {
      transform: scale(0%);
      opacity: 0;
    }
    5% {
      transform: scale(100%);
      opacity: 1;
    }
    95% {
      transform: scale(100%);
      opacity: 1;
    }
    100% {
      transform: scale(0%);
      opacity: 0;
    }
  }
`

export default Snackbar
