import { ModalGlobalStyles } from '@/styles/globals.modifiers'
import { BREAKPOINT_MOBILE } from '@/utils/utils.constants'
import { useOutsideAlerter } from '@/utils/utils.hooks'
import React, { FC, ReactNode, useRef } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai'
import styled from 'styled-components'

type Props = {
  closeModal: () => void
  children: ReactNode
  type?: 'confirm'
}

const Modal: FC<Props> = ({ closeModal, children, type }) => {
  const modalRef = useRef(null)
  useOutsideAlerter(modalRef, closeModal)

  return (
    <Style BREAKPOINT_MOBILE={BREAKPOINT_MOBILE} ref={modalRef} id='modal' type={type}>
      <ModalGlobalStyles />
      <AiFillCloseCircle id='close-btn' onClick={closeModal} />
      {children}
    </Style>
  )
}

type StyleProps = {
  type?: 'confirm'
  BREAKPOINT_MOBILE: number
}

const Style = styled.div<StyleProps>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  height: ${props => (props.type === 'confirm' ? '40%' : '70%')};
  width: ${props => (props.type === 'confirm' ? '40%' : '50%')};
  background-color: white;
  border: 1px solid gray;
  border-radius: 15px;
  animation: fadeIn 0.1s ease-out;
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  #close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 1.5rem;
    cursor: pointer;
  }
  @media screen and (max-width: ${props => props.BREAKPOINT_MOBILE}px) {
    width: 85%;
  }
`

export default Modal
