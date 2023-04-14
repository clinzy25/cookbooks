import React, { useRef, useState } from 'react'
import {
  AiFillCloseCircle,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from 'react-icons/ai'
import styled from 'styled-components'
import { formSteps, hoverStates } from '../utils/utils.cookbooks'
import { useUser } from '@auth0/nextjs-auth0/client'
import { api } from '@/api'
import axios from 'axios'

type Props = {
  setModalOpen: (bool: boolean) => void
}

const AddCookbookModal = ({ setModalOpen }: Props) => {
  const { user } = useUser()
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [hover, setHover] = useState<string>('')
  const [formError, setFormError] = useState(false)
  const [createCookbookLoading, setCreateCookbookLoading] = useState(false)
  const [createCookbookError, setCreateCookbookError] = useState(false)
  const [newCookbook, setNewCookbook] = useState({
    cookbook_name: '',
    creator_user_guid: user?.sub,
  })
  const nameFieldRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setCreateCookbookLoading(true)
      const response = await axios.post(`${api}/cookbooks`, { newCookbook })
      if (response.status === 200) {
        setModalOpen(false)
      } else {
        throw new Error('Cookbook creation failed')
      }
    } catch (e) {
      setCreateCookbookError(true)
      console.error(e)
    }
    setCreateCookbookLoading(false)
  }

  const handleStep = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (nameFieldRef?.current?.value) {
      setNewCookbook({
        ...newCookbook,
        cookbook_name: nameFieldRef.current.value,
      })
      setStep(1)
    } else {
      setFormError(true)
    }
  }

  return (
    <Style>
      <AiFillCloseCircle id='close-btn' onClick={() => setModalOpen(false)} />
      <h1>Create a new cookbook</h1>
      <form onSubmit={e => handleSubmit(e)}>
        {formSteps[step] === 'name' && (
          <>
            <div />
            <div className='input-ctr'>
              <label htmlFor='name'>
                <h2>Name Your Cookbook</h2>
                <input
                  autoFocus
                  placeholder='Type a name...'
                  type='text'
                  name='name'
                  defaultValue={newCookbook.cookbook_name}
                  ref={nameFieldRef}
                />
              </label>
              {formError && (
                <span className='error-msg'>Your cookbook needs a name!</span>
              )}
            </div>
            <div className='btn-ctr'>
              <button className='left-btn' onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button onClick={e => handleStep(e)}>
                Next: Add Recipes
                <AiOutlineArrowRight className='arrow-icon right' />
              </button>
            </div>
          </>
        )}
        {formSteps[step] === 'recipes' && (
          <>
            <div />
            <div>
              <div className='cta-ctr'>
                <h2>Add Recipes</h2>
                <p>To get started, add some recipes.</p>
              </div>
              <div>
                {Object.values(hoverStates).map(state => (
                  <button
                    key={state.btnText}
                    onMouseOut={() => setHover('')}
                    onMouseOver={() => setHover(state.hoverText)}>
                    {state.btnText}
                  </button>
                ))}

                <p className='hover-text'>{hover}</p>
              </div>
            </div>
            <div className='btn-ctr'>
              <button className='left-btn' onClick={() => setStep(0)}>
                <AiOutlineArrowLeft className='arrow-icon left' />
                Previous
              </button>
              <div>
                <button onClick={() => setStep(2)}>Skip</button>
                <button onClick={() => setStep(2)}>
                  Next: Invite people{' '}
                  <AiOutlineArrowRight className='arrow-icon right' />
                </button>
              </div>
            </div>
          </>
        )}
        {formSteps[step] === 'invite' && (
          <>
            <div />
            <div className='cta-ctr'>
              <h2>Invite People</h2>
              <p>Invite your friends and family to view and add recipes.</p>
              <button>Copy link</button>
            </div>
            <div className='btn-ctr'>
              <button className='left-btn' onClick={() => setStep(1)}>
                <AiOutlineArrowLeft className='arrow-icon left' />
                Previous
              </button>
              <div>
                <button type='submit'>Skip</button>
                <button type='submit'>Create cookbook</button>
              </div>
            </div>
          </>
        )}
      </form>
    </Style>
  )
}

const Style = styled.div`
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  h1 {
    margin-top: 10px;
  }
  form {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    .input-ctr {
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
    label {
      white-space: nowrap;
    }
    .cta-ctr {
      text-align: center;
    }
    .hover-text {
      text-align: center;
      height: 15px;
      min-width: 100%;
      max-width: min-content;
    }
    .btn-ctr {
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
    .left-btn {
      margin-right: auto;
    }
    button {
      padding: 15px 30px;
      margin: 15px;
      width: min-content;
      white-space: nowrap;
      border: 1px solid gray;
      border-radius: 10px;
      .arrow-icon {
        vertical-align: middle;
      }
      .right {
        margin-left: 10px;
      }
      .left {
        margin-right: 10px;
      }
    }
  }
`

export default AddCookbookModal
