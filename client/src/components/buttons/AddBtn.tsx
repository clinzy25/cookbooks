import React, { FC } from 'react'
import { AiFillPlusCircle } from 'react-icons/ai'
import styled from 'styled-components'

type Props = {
  handler: () => void
}

const AddBtn: FC<Props> = ({ handler }) => (
  <Style>
    <AiFillPlusCircle onClick={handler} />
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
