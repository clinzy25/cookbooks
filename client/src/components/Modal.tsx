import React, { FC, ReactNode } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai'
import styled from 'styled-components'

type Props = {
  closeModal: () => void
  children: ReactNode
}

const Modal: FC<Props> = ({ closeModal, children }: Props) => (
  <Style>
    <AiFillCloseCircle id='close-btn' onClick={closeModal} />
    {children}
  </Style>
)

const Style = styled.div`
  position: absolute;
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
  #close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 1.5rem;
    cursor: pointer;
  }
`

export default Modal
