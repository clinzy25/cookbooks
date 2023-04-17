import Modal from '@/components/Modal'
import React, { useRef, useState, ClipboardEvent } from 'react'
import styled from 'styled-components'
import { hoverStates } from '../utils/utils.cookbooks'
import { api } from '@/api'
import axios from 'axios'
import useAppContext from '@/context/app.context'
import { AppContextType } from '@/types/@types.context'
import { serverErrorMessages } from '@/utils/utils.server.errors'
import Loader from '@/components/Loader'
import { AxiosError } from 'axios'

type Props = {
  setModalOpen: (bool: boolean) => void
}

const AddRecipeModal = ({ setModalOpen }: Props) => {
  const { setSnackbar } = useAppContext() as AppContextType
  const [hover, setHover] = useState<string>('')
  const [selection, setSelection] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const linkFieldRef = useRef<HTMLInputElement>(null)

  const parseRecipe = async (url: string) => {
    try {
      setLoading(true)
      await axios.post(`${api}/recipes/parse`, { url })
      setSnackbar({
        msg: 'Recipe added!',
        state: 'success',
        duration: 3000,
      })
      setModalOpen(false)
    } catch (e: unknown) {
      console.error(e)
      if (e instanceof AxiosError) {
        const errorKey = e.response?.data.type
        setSnackbar({
          msg: serverErrorMessages.get(errorKey),
          state: 'error',
          duration: 3000,
        })
      }
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
    <Modal closeModal={() => setModalOpen(false)}>
      <Style>
        <h1>Add a Recipe</h1>
        <div className='ctr'>
          {selection === 'link' && (
            <label htmlFor='paste-link'>
              <input
                onPaste={e => handlePaste(e)}
                placeholder='Paste a link with a recipe...'
                type='text'
                ref={linkFieldRef}
              />
              <button onClick={handleClick}>{loading ? <Loader size={15} /> : 'Add'}</button>
            </label>
          )}
          <div>
            {Object.values(hoverStates).map(state => (
              <button
                className='selection-btn'
                key={state.btnText}
                onClick={() => setSelection(state.value)}
                onMouseOut={() => setHover('')}
                onMouseOver={() => setHover(state.hoverText)}>
                {state.btnText}
              </button>
            ))}
            <p className='hover-text'>{hover}</p>
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
  .ctr {
    margin-bottom: auto;
  }
  .hover-text {
    height: 15px;
    min-width: 100%;
    max-width: min-content;
    margin-top: 10px;
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
    align-items: center;
    margin-bottom: 15px;
    input {
      width: 100%;
      height: 48px;
    }
    .error-msg {
      color: red;
    }
  }
`

export default AddRecipeModal