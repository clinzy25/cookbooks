import React, { useRef, useState, FormEvent, ClipboardEvent, KeyboardEvent, FC } from 'react'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import styled from 'styled-components'
import { useUser } from '@auth0/nextjs-auth0/client'
import { api } from '@/api'
import axios from 'axios'
import useAppContext from '@/context/app.context'
import { IAppContext } from '@/types/@types.context'
import { useRouter } from 'next/router'
import { ICookbookReq } from '@/types/@types.cookbooks'
import { validateEmail } from '@/utils/utils.validateField'
import { IRecipeReq } from '@/types/@types.recipes'
import { IMemberReq } from '@/types/@types.user'
import Loader from '@/components/Loader'
import Modal from '@/components/Modal'
import { ModalBtnMixin, ModalFieldMixin, ModalHeaderMixin } from '@/styles/mixins'
import AddRecipeComponent from '@/components/AddRecipeComponent'
import { IoMdClose } from 'react-icons/io'

type Props = {
  setModalOpen: (bool: boolean) => void
}

const WelcomeModal: FC<Props> = ({ setModalOpen }) => {
  const { setSnackbar, handleServerError } = useAppContext() as IAppContext
  const router = useRouter()
  const { user } = useUser()
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [selection, setSelection] = useState<'link' | 'camera' | 'manual' | ''>('link')
  const [createLoading, setCreateLoading] = useState(false)
  const [recipes, setRecipes] = useState<IRecipeReq[]>([])
  const [invites, setInvites] = useState<IMemberReq[]>([])
  const [cookbook, setCookbook] = useState<ICookbookReq>({
    cookbook_name: '',
    creator_user_guid: '',
  })

  const nameFieldRef = useRef<HTMLInputElement>(null)
  const linkFieldRef = useRef<HTMLInputElement>(null)
  const emailFieldRef = useRef<HTMLInputElement>(null)
  const formSteps = ['cookbook', 'recipes', 'invite']

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setCreateLoading(true)
      const cookbookRes = await axios.post(`${api}/cookbooks`, cookbook).then(async res => {
        const { data: cookbook_guid } = res
        recipes.forEach(r => (r['cookbook_guid'] = cookbook_guid))
        invites.forEach(r => (r['cookbook_guid'] = cookbook_guid))
        const rPromise = await axios.post(`${api}/recipes/parse`, { recipes })
        const iPromise = await axios.post(`${api}/users/invite`, { invites })
        const allRes = await Promise.all([iPromise, rPromise])
        if (!allRes.every(r => r.data.status === 201)) {
          setSnackbar({ msg: 'Some actions were not have been completed.', state: 'error' })
        }
        return res
      })
      if (cookbookRes.status === 201) {
        setSnackbar({ msg: 'Cookbook created!', state: 'success' })
        setModalOpen(false)
        router.push(
          `/cookbooks/${cookbookRes.data}?cookbook_name=${cookbook.cookbook_name}&owner=1`
        )
      } else {
        throw new Error('Cookbook creation failed')
      }
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

  const handleAddRecipeClick = () => {
    const url = linkFieldRef.current?.value
    if (url) {
      const newRecipe: IRecipeReq = {
        url,
        source_type: selection,
        is_private: 0,
      }
      setRecipes([...recipes, newRecipe])
    }
  }

  const handleAddRecipePaste = (e: ClipboardEvent) => {
    const url = e.clipboardData?.getData('Text')
    if (url) {
      const newRecipe: IRecipeReq = {
        url,
        source_type: selection,
        is_private: 0,
      }
      setRecipes([...recipes, newRecipe])
    }
  }

  const handleRecipeDelete = (i: number) => {
    setRecipes([...recipes.slice(0, i), ...recipes.slice(i + 1)])
  }
  const handleInviteDelete = (i: number) => {
    setInvites([...invites.slice(0, i), ...invites.slice(i + 1)])
  }

  return (
    <Modal type='welcome' closeModal={() => setModalOpen(false)}>
      <Style>
        <h1>Welcome to Cookbooks!</h1>
        <p>To get started, let&apos;s create a cookbook.</p>
        <form autoComplete='off' onSubmit={e => handleSubmit(e)}>
          {/* disable enter key submit */}
          <input type='submit' disabled hidden />

          {/* Cookbook */}
          {formSteps[step] === 'cookbook' && (
            <div id='step-cookbook'>
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
              </label>
              <div className='btn-ctr'>
                <button type='button' onClick={e => validateCookbook(e)}>
                  Next: Add Recipes
                  <AiOutlineArrowRight className='arrow-icon right' />
                </button>
              </div>
            </div>
          )}

          {/* Recipes */}
          {formSteps[step] === 'recipes' && (
            <div id='step-recipes'>
              <AddRecipeComponent
                ref={linkFieldRef}
                handlePaste={handleAddRecipePaste}
                handleClick={handleAddRecipeClick}
                loading={false}
                setSelection={setSelection}
              />
              <h3>Recipe Queue</h3>
              <ul className='list'>
                {recipes.map((r, i) => (
                  <li className='pending-list-item' key={r.url}>
                    <span>{r.url}</span>
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
                    Next: Invite people <AiOutlineArrowRight className='arrow-icon right' />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Members */}
          {formSteps[step] === 'invite' && (
            <div id='step-members'>
              <h2>Invite People</h2>
              <label htmlFor='email'>
                <div className='cta-ctr'>
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
                </div>
              </label>
              <h3>Pending Invitations</h3>
              <ul className='list'>
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
              <div className='btn-ctr'>
                <button type='button' className='left-btn' onClick={() => setStep(1)}>
                  <AiOutlineArrowLeft className='arrow-icon left' />
                  Previous
                </button>
                <div>
                  <button type='submit'>Skip</button>
                  <button type='submit'>
                    {createLoading ? <Loader size={14} /> : 'Create Cookbook'}
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
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  ${ModalHeaderMixin}
  form {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 15px;
    #step-cookbook,
    #step-recipes,
    #step-members {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    #step-cookbook {
      label {
        margin: auto;
        width: 80%;
        ${ModalFieldMixin}
      }
    }
    #step-members {
      label {
        margin: auto;
        width: 75%;
        ${ModalFieldMixin}
        .input-ctr {
          display: flex;
          margin-top: 10px;
          ${ModalBtnMixin}
        }
      }
    }
    .btn-ctr {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      margin-top: auto;
      ${ModalBtnMixin}
      .left-btn {
        margin: 0 auto 0 0;
      }
      button {
        display: inline-flex;
        align-items: center;
        .right {
          margin-left: 5px;
        }
        .left {
          margin-right: 5px;
        }
      }
    }
    .list {
      list-style-type: none;
      text-align: center;
      background-color: ${({ theme }) => theme.secondaryBackgroundColor};
      border-radius: 10px;
      padding: 10px;
      height: 200px;
      overflow-y: auto;
      width: 75%;
      margin-bottom: 20px;
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
        span {
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
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
        label {
          width: 100%;
        }
      }
      .list {
        width: 100%;
      }
    }
    .btn-ctr {
      button {
        padding: 10px 8px !important;
      }
    }
  }
`

export default WelcomeModal