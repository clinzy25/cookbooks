import React, { useRef, useState, FormEvent } from 'react'
import styled from 'styled-components'
import { useUser } from '@auth0/nextjs-auth0/client'
import { api } from '@/api'
import axios from 'axios'
import useAppContext from '@/context/app.context'
import { AppContextType } from '@/types/@types.context'
import Modal from '@/components/Modal'
import { useRouter } from 'next/router'
import { ICookbookBeforeCreate } from '@/types/@types.cookbooks'

type Props = {
  setModalOpen: (bool: boolean) => void
}

const AddCookbookModal = ({ setModalOpen }: Props) => {
  const { setSnackbar, revalidateCookbooks } = useAppContext() as AppContextType
  const router = useRouter()
  const { user } = useUser()
  const [formError, setFormError] = useState(false)
  const nameFieldRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (nameFieldRef?.current?.value && user?.sub) {
        const cookbook: ICookbookBeforeCreate = {
          cookbook_name: nameFieldRef.current.value,
          creator_user_guid: user.sub,
        }
        const res = await axios.post(`${api}/cookbooks`, { cookbook })
        if (res.status === 201) {
          revalidateCookbooks()
          setSnackbar({
            msg: 'Cookbook created!',
            state: 'success',
            duration: 3000,
          })
          setModalOpen(false)
          router.push(`/cookbooks/${res.data.guid}`)
        }
      } else {
        setFormError(true)
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

  return (
    <Modal closeModal={() => setModalOpen(false)}>
      <Style>
        <h1>Create a new cookbook</h1>
        <form autoComplete='off' onSubmit={e => handleSubmit(e)}>
          <div />
          <label htmlFor='name'>
            <h2>Name Your Cookbook</h2>
            <input
              autoFocus
              placeholder='Type a name...'
              type='text'
              name='name'
              ref={nameFieldRef}
            />
            {/* For enter key */}
            <input type='submit' hidden />
            {formError && <span className='error-msg'>Your cookbook needs a name!</span>}
          </label>
          <div className='btn-ctr'>
            <button className='left-btn' onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type='submit'>Create Cookbook</button>
          </div>
        </form>
      </Style>
    </Modal>
  )
}

const Style = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
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
    label {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 40%;
      input {
        width: 100%;
        height: 40px;
      }
      .error-msg {
        color: red;
      }
      white-space: nowrap;
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
    }
  }
`

export default AddCookbookModal
