import { ModalGlobalStyles } from '@/styles/globals.modifiers'
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
    <Style ref={modalRef} id='modal' type={type}>
      <ModalGlobalStyles />
      <AiFillCloseCircle id='close-btn' onClick={closeModal} />
      {children}
    </Style>
  )
}

type StyleProps = {
  type?: 'confirm'
}

const Style = styled.div<StyleProps>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  height: ${props => (props.type === 'confirm' ? '40%' : '80%')};
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
`

export default Modal
