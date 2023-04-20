import React, { useRef, useState, FormEvent, ClipboardEvent, KeyboardEvent } from 'react'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import styled from 'styled-components'
import { useUser } from '@auth0/nextjs-auth0/client'
import { api } from '@/api'
import axios from 'axios'
import useAppContext from '@/context/app.context'
import { AppContextType } from '@/types/@types.context'
import { useRouter } from 'next/router'
import { serverErrorMessage } from '@/utils/utils.server.errors'
import { hoverStates } from '@/utils/utils.hoverStates'
import { ICookbookBeforeCreate } from '@/types/@types.cookbooks'
import { validateEmail } from '@/utils/utils.validateField'

const WelcomePage = () => {
  const { setSnackbar, revalidateCookbooks } = useAppContext() as AppContextType
  const router = useRouter()
  const { user } = useUser()
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [cookbookError, setCookbookError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [selection, setSelection] = useState<'link' | 'camera' | 'manual' | ''>('')
  const [recipeUrls, setRecipeUrls] = useState<string[]>([])
  const [invites, setInvites] = useState<string[]>([])
  const [cookbook, setCookbook] = useState<ICookbookBeforeCreate>({
    cookbook_name: '',
    creator_user_guid: '',
  })

  const nameFieldRef = useRef<HTMLInputElement>(null)
  const linkFieldRef = useRef<HTMLInputElement>(null)
  const emailFieldRef = useRef<HTMLInputElement>(null)
  const formSteps = ['name', 'recipes', 'invite']

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newCookbook = {
      cookbook_name: '',
      creator_user_guid: user?.sub,
    }
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
      serverErrorMessage(e, setSnackbar)
      console.error(e)
    }
  }

  const validateCookbook = (
    e: FormEvent<HTMLButtonElement> | KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault()
    if (nameFieldRef?.current?.value && user?.sub) {
      setCookbook({
        cookbook_name: nameFieldRef.current.value,
        creator_user_guid: user.sub,
      })
      setStep(1)
    } else {
      setCookbookError(true)
    }
  }

  const validateInvite = (
    e: FormEvent<HTMLButtonElement> | KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault()
    const email = emailFieldRef?.current?.value
    const isValidEmail = email && validateEmail(email)
    if (email && isValidEmail) {
      setInvites([...invites, email])
    } else {
      setEmailError(true)
    }
  }

  const handleAddRecipeClick = () => {
    const url = linkFieldRef.current?.value
    url && setRecipeUrls([...recipeUrls, url])
  }

  const handleAddRecipePaste = (e: ClipboardEvent) => {
    const url = e.clipboardData?.getData('Text')
    url && setRecipeUrls([...recipeUrls, url])
  }

  return (
    <Style>
      <h1>Welcome to Cookbooks!</h1>
      <p>To get started, let&apos;s create a cookbook.</p>
      <form autoComplete='off' onSubmit={e => handleSubmit(e)}>
        {/* disable enter key submit */}
        <input type='submit' disabled hidden />
        {formSteps[step] === 'name' && (
          <>
            <div />
            <label htmlFor='cookbook-name'>
              <h2>Name Your Cookbook</h2>
              <input
                onKeyDown={e => e.key === 'Enter' && validateCookbook(e)}
                autoFocus
                placeholder='Type a name...'
                type='text'
                name='cookbook-name'
                defaultValue={cookbook.cookbook_name}
                ref={nameFieldRef}
              />
              {cookbookError && <p className='error-msg'>Your cookbook needs a name!</p>}
            </label>
            <div className='btn-ctr'>
              <button type='button' onClick={e => validateCookbook(e)}>
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
              <label htmlFor='paste-link'>
                <div className='cta-ctr'>
                  <h2>Add Recipes</h2>
                  <p>There are 3 different ways to add recipes</p>
                  <ol>
                    <li>
                      Paste a link to a website with a recipe and we&apos;ll save the recipe
                      for you.
                    </li>
                    <li>
                      Take a picture of a recipe (like from a cookbook) and we&apos;ll save it
                      for you.
                    </li>
                    <li>Type a recipe yourself.</li>
                  </ol>
                </div>
                {selection === 'link' && (
                  <div className='input-ctr'>
                    <input
                      name='paste-link'
                      onPaste={e => handleAddRecipePaste(e)}
                      placeholder='Paste a link with a recipe...'
                      type='text'
                      ref={linkFieldRef}
                    />
                    <button type='button' onClick={handleAddRecipeClick}>
                      Add
                    </button>
                  </div>
                )}
              </label>
              <div>
                {Object.values(hoverStates).map(state => (
                  <button
                    type='button'
                    className='selection-btn'
                    key={state.btnText}
                    onClick={() => setSelection(state.value)}>
                    {state.btnText}
                  </button>
                ))}
              </div>
            </div>
            <ul>
              {recipeUrls.map(r => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <div className='btn-ctr'>
              <button type='button' className='left-btn' onClick={() => setStep(0)}>
                <AiOutlineArrowLeft className='arrow-icon left' />
                Previous
              </button>
              <div>
                <button type='button' onClick={() => setStep(2)}>
                  Skip
                </button>
                <button type='button' onClick={() => setStep(2)}>
                  Next: Invite people <AiOutlineArrowRight className='arrow-icon right' />
                </button>
              </div>
            </div>
          </>
        )}
        {formSteps[step] === 'invite' && (
          <>
            <div />
            <label htmlFor='email'>
              <div className='cta-ctr'>
                <h2>Invite People</h2>
                <p>Invite your friends and family to view and add recipes.</p>
              </div>
              <div className='input-ctr'>
                <input
                  name='email'
                  ref={emailFieldRef}
                  placeholder='Type an email address...'
                  onKeyDown={e => e.key === 'Enter' && validateInvite(e)}
                  type='text'
                />
                <button type='button' name='invite-field' onClick={validateInvite}>
                  Queue invite
                </button>
                {emailError && <p className='error-msg'>Invalid email</p>}
              </div>
            </label>
            <h2>Pending Invitations</h2>
            <ul>
              {invites.map(i => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            <div className='btn-ctr'>
              <button type='button' className='left-btn' onClick={() => setStep(1)}>
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
    height: 70%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    input {
      width: 70%;
      height: 48px;
    }
    .error-msg {
      color: red;
    }
    label {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      white-space: nowrap;
      text-align: center;
      .cta-ctr {
        ol {
          text-align: left;
        }
      }
      .input-ctr {
        width: 100%;
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
