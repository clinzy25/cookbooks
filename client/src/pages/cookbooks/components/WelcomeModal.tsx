import React, { useRef, useState, FormEvent, KeyboardEvent, FC } from 'react'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import styled from 'styled-components'
import { useUser } from '@auth0/nextjs-auth0/client'
import { api } from '@/api'
import axios from 'axios'
import useAppContext from '@/context/app.context'
import { IAppContext } from '@/types/@types.context'
import { ICookbookReq } from '@/types/@types.cookbooks'
import { validateEmail } from '@/utils/utils.validateField'
import { IRecipeReq, RecipeSourceTypes } from '@/types/@types.recipes'
import { IMemberReq } from '@/types/@types.user'
import Loader from '@/components/Loader'
import Modal from '@/components/Modal'
import {
  ModalBtnMixin,
  ModalFieldMixin,
  ModalHeaderMixin,
  PlannedFeatureMixin,
} from '@/styles/mixins'
import AddRecipeComponent from '@/components/AddRecipeComponent'
import { IoMdClose } from 'react-icons/io'
import packageJson from '../../../../package.json'
import { BsFillPersonPlusFill } from 'react-icons/bs'

type Props = {
  setModalOpen: (bool: boolean) => void
  modalOpen: boolean
}

const WelcomeModal: FC<Props> = ({ setModalOpen, modalOpen }) => {
  const { setSnackbar, handleServerError, revalidateCookbooks, revalidateTags } =
    useAppContext() as IAppContext
  const { user } = useUser()
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [createLoading, setCreateLoading] = useState(false)
  const [recipes, setRecipes] = useState<IRecipeReq[]>([])
  const [invites, setInvites] = useState<IMemberReq[]>([])
  const [cookbook, setCookbook] = useState<ICookbookReq>({
    cookbook_name: '',
    creator_user_guid: '',
  })

  const nameFieldRef = useRef<HTMLInputElement>(null)
  const emailFieldRef = useRef<HTMLInputElement>(null)
  const formSteps = ['cookbook', 'recipes', 'invite']

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setCreateLoading(true)
      await axios.post(`${api}/cookbooks`, cookbook).then(async res => {
        const { data: cookbook_guid } = res
        recipes.forEach(r => (r['cookbook_guid'] = cookbook_guid))
        invites.forEach(r => (r['cookbook_guid'] = cookbook_guid))
        const rPromise = axios.post(`${api}/recipes/parse`, { recipes })
        const iPromise = axios.post(`${api}/users/invite`, { invites })
        await Promise.allSettled([iPromise, rPromise]).then(res => {
          if (!res.every(r => r.status === 'fulfilled')) {
            setSnackbar({ msg: 'Some actions were not completed.', state: 'error' })
          } else {
            setSnackbar({ msg: 'Cookbook created!', state: 'success' })
          }
        })
        return res
      })
      setModalOpen(false)
      revalidateCookbooks()
      revalidateTags()
    } catch (e) {
      handleServerError(e)
      console.error(e)
    }
    setCreateLoading(false)
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
      setSnackbar({ msg: 'Your cookbook needs a name!', state: 'error' })
    }
  }

  const validateInvite = (
    e: FormEvent<HTMLButtonElement> | KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault()
    const email = emailFieldRef?.current?.value
    const isValidEmail = email && validateEmail(email)
    if (email && isValidEmail) {
      setInvites([...invites, { email }])
    } else {
      setSnackbar({ msg: 'Invalid email', state: 'error' })
    }
  }

  const validateUrl = (url: string) => {
    try {
      if (recipes.length === 10) {
        setSnackbar({ msg: 'Max 10, you can add more later!', state: 'error' })
        return false
      } else {
        new URL(url)
        return true
      }
    } catch (_) {
      setSnackbar({ msg: 'Invalid url', state: 'error' })
      return false
    }
  }

  const handleRecipeAdd = (url: string, selection: RecipeSourceTypes) => {
    if (url) {
      const isValid = validateUrl(url)
      if (isValid) {
        const newRecipe: IRecipeReq = {
          url,
          source_type: selection,
          is_private: 0,
        }
        setRecipes([...recipes, newRecipe])
      }
    }
  }

  const handleRecipeDelete = (i: number) => {
    setRecipes([...recipes.slice(0, i), ...recipes.slice(i + 1)])
  }

  const handleInviteDelete = (i: number) => {
    setInvites([...invites.slice(0, i), ...invites.slice(i + 1)])
  }

  return (
    <Modal modalOpen={modalOpen} type='welcome' closeModal={() => setModalOpen(false)}>
      <Style>
        <form autoComplete='off' onSubmit={e => handleSubmit(e)}>
          {/* disable enter key submit */}
          <input type='submit' disabled hidden />

          {/* Cookbook */}
          {formSteps[step] === 'cookbook' && (
            <div id='step-cookbook'>
              <h1>Welcome to Cookbooks!</h1>
              <p>To get started, let&apos;s create a cookbook.</p>
              <label className='label' htmlFor='cookbook-name'>
                <input
                  onKeyDown={e => e.key === 'Enter' && validateCookbook(e)}
                  autoFocus
                  placeholder='Name Your Cookbook...'
                  type='text'
                  name='cookbook-name'
                  defaultValue={cookbook.cookbook_name}
                  ref={nameFieldRef}
                />
              </label>
              <div className='btn-ctr'>
                <button type='button' onClick={e => validateCookbook(e)}>
                  Next
                  <AiOutlineArrowRight className='arrow-icon right' />
                </button>
              </div>
            </div>
          )}

          {/* Recipes */}
          {formSteps[step] === 'recipes' && (
            <div id='step-recipes'>
              <AddRecipeComponent
                sourceType='link'
                handleSubmit={handleRecipeAdd}
                loading={false}
              />
              <ul className='list'>
                <h3 className='sub-header'>Recipe Queue (Max 10)</h3>
                {recipes.map((r, i) => (
                  <li className='pending-list-item' key={r.url}>
                    <a href={r.url} target='_blank'>
                      {r.url}
                    </a>
                    <div>
                      <IoMdClose
                        title='Remove recipe'
                        onClick={() => handleRecipeDelete(i)}
                        className='delete-icon'
                      />
                    </div>
                  </li>
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
                    Next
                    <AiOutlineArrowRight className='arrow-icon right' />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Members */}
          {formSteps[step] === 'invite' && (
            <div id='step-members'>
              <h1>Invite People</h1>
              <p>Invite your friends and family to view and add recipes.</p>
              {packageJson.version !== '1.2.0' ? (
                <div className='feature'>
                  <p>Membership and invites coming soon!</p>
                  <BsFillPersonPlusFill className='feature-icon' />
                </div>
              ) : (
                <>
                  <label className='label' htmlFor='email'>
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
                    </div>
                  </label>
                  <ul className='list'>
                    <h3 className='sub-header'>Pending Invitations</h3>
                    {invites.map((invite, i) => (
                      <li className='pending-list-item' key={invite.email}>
                        <span>{invite.email}</span>
                        <div>
                          <IoMdClose
                            title='Dequeue Member'
                            onClick={() => handleInviteDelete(i)}
                            className='delete-icon'
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <div className='btn-ctr'>
                <button type='button' className='left-btn' onClick={() => setStep(1)}>
                  <AiOutlineArrowLeft className='arrow-icon left' />
                  Previous
                </button>
                <div>
                  <button type='submit'>Skip</button>
                  <button type='submit'>
                    {createLoading ? <Loader size={14} /> : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </Style>
    </Modal>
  )
}

const Style = styled.main`
  height: 100%;
  ${ModalHeaderMixin}
  .sub-header {
    font: ${({ theme }) => theme.modalSubHeaderFont};
  }
  form {
    height: 100%;
    display: flex;
    #step-cookbook,
    #step-recipes,
    #step-members {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      ${ModalFieldMixin}
      & > p {
        text-align: center;
        margin-bottom: 10px;
      }
      .label {
        margin: auto;
        width: 70%;
      }
    }
    #step-members {
      .label {
        .input-ctr {
          display: flex;
          margin: 150px 0 10px 0;
          ${ModalBtnMixin}
        }
      }
    }
    ${PlannedFeatureMixin}
    .btn-ctr {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      margin-top: 50px;
      ${ModalBtnMixin}
      .left-btn {
        margin: 0 auto 0 0;
      }
      button {
        .right {
          margin-left: 5px;
        }
        .left {
          margin-right: 5px;
        }
      }
    }
    .list {
      flex-grow: 1;
      width: 69%;
      min-height: 150px;
      text-align: left;
      list-style-type: none;
      overflow-y: auto;
      padding: 10px;
      margin-bottom: 20px;
      border-radius: 10px;
      background-color: ${({ theme }) => theme.secondaryBackgroundColor};
      .pending-list-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: ${({ theme }) => theme.mainBackgroundColor};
        letter-spacing: 0.5px;
        margin: 3px 0;
        white-space: nowrap;
        border-radius: 10px;
        padding: 3px;
        text-decoration: underline;
        overflow-x: hidden;
        div {
          display: flex;
        }
        a {
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          color: ${({ theme }) => theme.linkColor};
        }
        .delete-icon {
          background-color: ${({ theme }) => theme.errorColor};
          border-radius: 25px;
          cursor: pointer;
          padding: 2px;
          color: white;
        }
      }
    }
  }
  @media screen and (max-width: ${({ theme }) => theme.breakpointMobile}px) {
    form {
      #step-cookbook,
      #step-members {
        .label {
          width: 100%;
          input {
            width: 100%;
          }
        }
      }
      .list {
        width: 100%;
      }
    }
    .btn-ctr,
    .input-ctr {
      button {
        padding: 12px 15px !important;
      }
    }
  }
`

export default WelcomeModal
