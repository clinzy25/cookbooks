import React, { ReactElement, ReactNode, forwardRef } from 'react'
import styled from 'styled-components'
import { CSSTransition } from 'react-transition-group'

type Props = {
  children: ReactNode
  ref: ReactElement
  state: boolean
}

const TransitionWrapper = forwardRef<HTMLButtonElement, React.PropsWithChildren<Props>>(
  (props, ref) => (
    <Style id='modal'>
      <CSSTransition
        nodeRef={ref}
        in={props.state}
        unmountOnExit
        appear
        timeout={100}
        classNames='transition'>
        {props.children}
      </CSSTransition>
    </Style>
  )
)

const Style = styled.div`
  .transition-enter {
    opacity: 0;
  }
  .transition-enter-active {
    opacity: 1;
    transition: opacity 100ms;
  }
  .transition-exit {
    opacity: 1;
  }
  .transition-exit-active {
    opacity: 0;
    transition: opacity 100ms;
  }
`

export default TransitionWrapper
