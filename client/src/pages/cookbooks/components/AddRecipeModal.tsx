import Modal from '@/components/Modal'
import React from 'react'
import styled from 'styled-components'

type Props = {
  setModalOpen: (bool: boolean) => void
}

const AddRecipeModal = ({ setModalOpen }: Props) => {
  return (
    <Modal closeModal={() => setModalOpen(false)}>
      <Style>AddRecipeModal</Style>
    </Modal>
  )
}

const Style = styled.div``

export default AddRecipeModal
