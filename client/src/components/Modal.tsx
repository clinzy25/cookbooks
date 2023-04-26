import { ModalGlobalStyles } from '@/styles/globals.modifiers'
import { useOutsideAlerter } from '@/utils/utils.hooks'
import React, { FC, ReactNode, useRef } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai'
import styled from 'styled-components'

type Props = {
  closeModal: () => void
  children: ReactNode
}

const Modal: FC<Props> = ({ closeModal, children }) => {
  const modalRef = useRef(null)
  useOutsideAlerter(modalRef, closeModal)

  return (
    <Style ref={modalRef} id='modal'>
      <ModalGlobalStyles />
      <AiFillCloseCircle id='close-btn' onClick={closeModal} />
      {children}
    </Style>
  )
}

const Style = styled.div`
  position: fixed;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  z-index: 2;
  height: 80%;
  width: 50%;
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
