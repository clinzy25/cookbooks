import useAppContext from '@/context/app.context'
import { ModalGlobalStyles } from '@/styles/globals.modifiers'
import { IAppContext } from '@/types/@types.context'
import { useOutsideAlerter } from '@/utils/utils.hooks'
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai'
import styled from 'styled-components'

type Props = {
  closeModal: () => void
  children: ReactNode
  type?: 'confirm' | 'edit-cookbook' | 'default' | 'welcome' | 'bug'
}

const Modal: FC<Props> = ({ closeModal, children, type = 'default' }) => {
  const { tagsEditMode } = useAppContext() as IAppContext
  const modalRef = useRef(null)
  const [overrideClose, setOverrideClose] = useState(false)
  useOutsideAlerter(modalRef, overrideClose ? () => null : closeModal)

  useEffect(() => {
    setOverrideClose(type === 'welcome' || tagsEditMode)
  }, [tagsEditMode])

  const dimensions = {
    confirm: {
      height: 40,
      width: 40,
    },
    'edit-cookbook': {
      height: 70,
      width: 50,
    },
    welcome: {
      height: 80,
      width: 50,
    },
    bug: {
      height: 70,
      width: 40,
    },
    default: {
      height: 70,
      width: 50,
    },
  }

  return (
    <Style ref={modalRef} id='modal' type={type} dimensions={dimensions}>
      <ModalGlobalStyles />
      {type !== 'welcome' && <AiFillCloseCircle id='close-btn' onClick={closeModal} />}
      {children}
    </Style>
  )
}

type StyleProps = {
  type: 'confirm' | 'edit-cookbook' | 'default' | 'welcome' | 'bug'
  dimensions: { [key: string]: { height: number | string; width: number } }
}

const Style = styled.div<StyleProps>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  height: ${props => props.dimensions[props.type].height}%;
  width: ${props => props.dimensions[props.type].width}%;
  background-color: ${({ theme }) => theme.mainBackgroundColor};
  border: 1px solid gray;
  border-radius: 15px;
  padding: 15px;
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
  @media screen and (max-width: 1300px) {
    width: 70%;
  }
  @media screen and (max-width: ${({ theme }) => theme.breakpointMobile}px) {
    width: 90%;
  }
`

export default Modal
