import Modal from '@/components/Modal'
import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { hoverStates } from '../utils/utils.cookbooks'

type Props = {
  setModalOpen: (bool: boolean) => void
}

const AddRecipeModal = ({ setModalOpen }: Props) => {
  const [hover, setHover] = useState<string>('')
  const [selection, setSelection] = useState<string>('')
  const [formError, setFormError] = useState(false)
  const linkFieldRef = useRef<HTMLInputElement>(null)

  const parseRecipe = (e: React.ClipboardEvent) => {
    if (e.clipboardData?.getData('Text')) {
      formError && setFormError(false)
    } else {
      setFormError(true)
    }
  }

  return (
    <Modal closeModal={() => setModalOpen(false)}>
      <Style>
        <h1>Add a Recipe</h1>
        <div>
          {selection === 'link' && (
            <label htmlFor='paste-link'>
              <input
                onPaste={e => parseRecipe(e)}
                placeholder='Paste a link with a recipe...'
                type='text'
                ref={linkFieldRef}
              />
              {formError && (
                <span className='error-msg'>Link format is invalid.</span>
              )}
            </label>
          )}
          <div>
            {Object.values(hoverStates).map(state => (
              <button
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
  justify-content: center;
  text-align: center;
  h1,
  div {
    margin-bottom: auto;
  }
  .hover-text {
    height: 15px;
    min-width: 100%;
    max-width: min-content;
  }
  button {
    padding: 15px 30px;
    margin: 15px;
    width: min-content;
    white-space: nowrap;
    border: 1px solid gray;
    border-radius: 10px;
  }
  label {
    display: flex;
    flex-direction: column;
    input {
      width: 100%;
      height: 40px;
    }
    .error-msg {
      color: red;
    }
  }
`

export default AddRecipeModal
