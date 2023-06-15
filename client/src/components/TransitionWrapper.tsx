import React, { ReactElement, ReactNode, forwardRef } from 'react'
import styled from 'styled-components'
import { CSSTransition } from 'react-transition-group'

type Props = {
  children: ReactNode
  ref: ReactElement
  state: boolean | string
}

const TransitionWrapper = forwardRef<HTMLElement, React.PropsWithChildren<Props>>(
  (props, ref) => (
    <Style id='modal'>
      <CSSTransition
        nodeRef={ref}
        // handle state as string from AddRecipeModal
        in={typeof props.state === 'boolean' ? props.state : props.state ? true : false}
        unmountOnExit
        appear
        timeout={200}
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
    transition: opacity 200ms;
  }
  .transition-exit {
    opacity: 1;
  }
  .transition-exit-active {
    opacity: 0;
    transition: opacity 200ms;
  }
`

export default TransitionWrapper
