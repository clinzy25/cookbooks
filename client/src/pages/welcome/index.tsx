import React, { useRef, useState, FormEvent, useEffect } from 'react'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import styled from 'styled-components'
import { useUser } from '@auth0/nextjs-auth0/client'
import { api } from '@/api'
import axios from 'axios'
import useAppContext from '@/context/app.context'
import { AppContextType } from '@/types/@types.context'
import { useRouter } from 'next/router'

const WelcomePage = () => {
  const { setSnackbar, revalidateCookbooks } = useAppContext() as AppContextType
  const router = useRouter()
  const { user } = useUser()
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [formError, setFormError] = useState(false)
  const [newCookbook, setNewCookbook] = useState({
    cookbook_name: '',
    creator_user_guid: user?.sub,
  })
  const nameFieldRef = useRef<HTMLInputElement>(null)
  const formSteps = ['name', 'recipes', 'invite']

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${api}/cookbooks`, { newCookbook })
      if (res.status === 201) {
        revalidateCookbooks()
        setSnackbar({
          msg: 'Cookbook created!',
          state: 'success',
          duration: 3000,
        })
        router.push(`/cookbooks/${res.data.guid}`)
      } else {
        throw new Error('Cookbook creation failed')
      }
    } catch (e) {
      setSnackbar({
        msg: 'Sorry! Something went wrong.',
        state: 'error',
        duration: 3000,
      })
      console.error(e)
    }
  }

  const validateStep = (e: FormEvent<HTMLButtonElement>) => {
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

  useEffect(() => {
    // user is initially undefined
    user && setNewCookbook({ ...newCookbook, creator_user_guid: user.sub })
  }, [user]) // eslint-disable-line

  return (
    <Style>
      <h1>Welcome to Cookbooks!</h1>
      <p>To get started, let&apos;s create a cookbook.</p>
      <form autoComplete='off' onSubmit={e => handleSubmit(e)}>
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
              {formError && <span className='error-msg'>Your cookbook needs a name!</span>}
            </div>
            <div className='btn-ctr'>
              <button onClick={e => validateStep(e)}>
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
                <p>There are 3 different ways to add recipes</p>
                <ol>
                  <li>
                    Paste a link to a website with a recipe and we&apos;ll save the recipe for
                    you.
                  </li>
                  <li>
                    Take a picture of a recipe (like from a cookbook) and we&apos;ll save it
                    for you.
                  </li>
                  <li>Type a recipe yourself.</li>
                </ol>
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
                  Next: Invite people <AiOutlineArrowRight className='arrow-icon right' />
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

const Style = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  h1 {
    margin-top: 10px;
  }
  form {
    width: 50%;
    height: 50%;
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
      ol {
        text-align: left;
      }
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

export default WelcomePage
