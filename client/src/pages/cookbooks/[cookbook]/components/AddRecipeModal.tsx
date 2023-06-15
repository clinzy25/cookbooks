import Modal from '@/components/Modal'
import React, { useState, FC } from 'react'
import { api } from '@/api'
import axios from 'axios'
import useAppContext from '@/context/app.context'
import { IAppContext } from '@/types/@types.context'
import { IRecipeReq, RecipeSourceTypes } from '@/types/@types.recipes'
import { useRouter } from 'next/router'
import AddRecipeComponent from '@/components/AddRecipeComponent'

type Props = {
  setRecipeModal: (sourceType: RecipeSourceTypes) => void
  revalidateRecipes: () => void
  modalOpen: RecipeSourceTypes
}

const AddRecipeModal: FC<Props> = ({ revalidateRecipes, setRecipeModal, modalOpen }) => {
  const {
    query: { cookbook },
  } = useRouter()
  const { setSnackbar, revalidateTags, handleServerError } = useAppContext() as IAppContext
  const [loading, setLoading] = useState(false)

  const parseRecipe = async (url: string, selection: RecipeSourceTypes) => {
    try {
      setLoading(true)
      const recipes: IRecipeReq[] = [
        {
          url,
          cookbook_guid: cookbook,
          source_type: selection,
          is_private: 0,
        },
      ]
      await axios.post(`${api}/recipes/parse`, { recipes })
      setSnackbar({ msg: 'Recipe added!', state: 'success' })
      revalidateRecipes()
      revalidateTags()
      setRecipeModal('')
    } catch (e) {
      handleServerError(e)
    }
    setLoading(false)
  }

  return (
    <Modal modalOpen={modalOpen} type='default' closeModal={() => setRecipeModal('')}>
      <AddRecipeComponent sourceType={modalOpen} handleSubmit={parseRecipe} loading={loading} />
    </Modal>
  )
}

export default AddRecipeModal
