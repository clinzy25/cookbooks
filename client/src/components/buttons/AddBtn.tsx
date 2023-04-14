import React from 'react'
import { AiFillPlusCircle } from 'react-icons/ai'
import styled from 'styled-components'

type Props = {
  handler: () => unknown
}

const AddBtn = ({ handler }: Props) => (
  <Style>
    <AiFillPlusCircle onClick={handler} id='add-cookbook-icon' />
  </Style>
)

const Style = styled.div`
  position: fixed;
  right: 50px;
  bottom: 50px;
  font-size: 3.5rem;
  cursor: pointer;
`
export default AddBtn
