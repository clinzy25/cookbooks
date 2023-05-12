import Modal from '@/components/Modal'
import React, { useRef, useState, ClipboardEvent, FC } from 'react'
import { api } from '@/api'
import axios from 'axios'
import useAppContext from '@/context/app.context'
import { IAppContext } from '@/types/@types.context'
import { IRecipeReq, RecipeSourceTypes } from '@/types/@types.recipes'
import { useRouter } from 'next/router'
import AddRecipeComponent from '@/components/AddRecipeComponent'

type Props = {
  setRecipeModal: (bool: boolean) => void
  revalidateRecipes: () => void
}

const AddRecipeModal: FC<Props> = ({ revalidateRecipes, setRecipeModal }) => {
  const {
    query: { cookbook },
  } = useRouter()
  const { setSnackbar, revalidateTags, handleServerError } = useAppContext() as IAppContext
  const [selection, setSelection] = useState<RecipeSourceTypes>('link')
  const [loading, setLoading] = useState(false)
  const linkFieldRef = useRef<HTMLInputElement>(null)

  const parseRecipe = async (url: string) => {
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
      setRecipeModal(false)
    } catch (e) {
      handleServerError(e)
    }
    setLoading(false)
  }

  const handleClick = () => {
    const url = linkFieldRef.current?.value
    url && parseRecipe(url)
  }

  const handlePaste = (e: ClipboardEvent) => {
    const url = e.clipboardData?.getData('Text')
    parseRecipe(url)
  }

  return (
    <Modal type='default' closeModal={() => setRecipeModal(false)}>
      <AddRecipeComponent
        ref={linkFieldRef}
        handlePaste={handlePaste}
        handleClick={handleClick}
        loading={loading}
        setSelection={setSelection}
      />
    </Modal>
  )
}

export default AddRecipeModal
