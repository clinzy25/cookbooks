import Modal from '@/components/Modal'
import React, { useRef, useState, ClipboardEvent, FC } from 'react'
import styled from 'styled-components'
import { api } from '@/api'
import axios from 'axios'
import useAppContext from '@/context/app.context'
import { IAppContext } from '@/types/@types.context'
import Loader from '@/components/Loader'
import { IRecipeReq, RecipeSourceTypes } from '@/types/@types.recipes'

type Props = {
  setRecipeModal: (bool: boolean) => void
  revalidateRecipes: () => void
}

const AddRecipeModal: FC<Props> = ({ revalidateRecipes, setRecipeModal }) => {
  const { setSnackbar, currentCookbook, revalidateTags, handleServerError } =
    useAppContext() as IAppContext
  const [selection, setSelection] = useState<RecipeSourceTypes>('')
  const [loading, setLoading] = useState(false)
  const linkFieldRef = useRef<HTMLInputElement>(null)

  const parseRecipe = async (url: string) => {
    try {
      setLoading(true)
      const recipes: IRecipeReq[] = [
        {
          url,
          cookbook_guid: currentCookbook?.guid,
          source_type: selection,
          is_private: 0,
        },
      ]
      await axios.post(`${api}/recipes/parse`, { recipes })
      setSnackbar({ msg: 'Recipe added!', state: 'success' })
      revalidateRecipes()
      revalidateTags()
      setRecipeModal(false)
    } catch (e: unknown) {
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
    <Modal closeModal={() => setRecipeModal(false)}>
      <Style>
        <h1>Add a Recipe</h1>
        <div>
          <label htmlFor='paste-link'>
            <h2>Add Recipes</h2>
            <p>There are 3 different ways to add recipes</p>
            <ol>
              <li>
                Paste a link to a website with a recipe and we&apos;ll save the recipe for you.
              </li>
              <li>
                Take a picture of a recipe (like from a cookbook) and we&apos;ll save it for
                you.
              </li>
              <li>Type a recipe yourself.</li>
            </ol>
            {selection === 'link' && (
              <div className='input-ctr'>
                <input
                  onPaste={e => handlePaste(e)}
                  placeholder='Paste a link with a recipe...'
                  type='text'
                  ref={linkFieldRef}
                />
                <button onClick={handleClick}>{loading ? <Loader size={15} /> : 'Add'}</button>
              </div>
            )}
          </label>
          <div>
            <button
              type='button'
              className='selection-btn'
              onClick={() => setSelection('link')}>
              Paste Link
            </button>
            <button
              type='button'
              className='selection-btn'
              onClick={() => setSelection('camera')}>
              From Camera
            </button>
            <button
              type='button'
              className='selection-btn'
              onClick={() => setSelection('manual')}>
              Enter Manually
            </button>
          </div>
        </div>
      </Style>
    </Modal>
  )
}

const Style = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  h1,
  div:first-of-type {
    margin-bottom: auto;
  }
  ol {
    text-align: left;
  }
  button {
    padding: 15px 30px;
    width: min-content;
    white-space: nowrap;
    border: 1px solid gray;
    border-radius: 10px;
    &:nth-child(2) {
      margin-left: 15px;
    }
  }
  .selection-btn {
    &:nth-child(2) {
      margin: 0 15px;
    }
  }
  label {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 15px;
    .input-ctr {
      display: flex;
      justify-content: center;
      width: 100%;
      input {
        width: 70%;
        height: 48px;
      }
    }
    .error-msg {
      color: red;
    }
  }
`

export default AddRecipeModal
