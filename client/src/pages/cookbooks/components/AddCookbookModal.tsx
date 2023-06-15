import React, { useRef, FormEvent, FC } from 'react'
import styled from 'styled-components'
import { useUser } from '@auth0/nextjs-auth0/client'
import { api } from '@/api'
import axios from 'axios'
import useAppContext from '@/context/app.context'
import { IAppContext } from '@/types/@types.context'
import Modal from '@/components/Modal'
import { ICookbookReq } from '@/types/@types.cookbooks'
import { ModalBtnMixin, ModalFieldMixin, ModalHeaderMixin } from '@/styles/mixins'

type Props = {
  setModalOpen: (bool: boolean) => void
  modalOpen: boolean
}

const AddCookbookModal: FC<Props> = ({ setModalOpen, modalOpen }) => {
  const { setSnackbar, handleServerError, revalidateCookbooks } =
    useAppContext() as IAppContext
  const { user } = useUser()
  const nameFieldRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const cookbook_name = nameFieldRef.current?.value
      if (cookbook_name && user?.sub) {
        const cookbook: ICookbookReq = {
          cookbook_name: nameFieldRef.current.value,
          creator_user_guid: user.sub,
        }
        const res = await axios.post(`${api}/cookbooks`, cookbook)
        if (res.status === 201) {
          revalidateCookbooks()
          setSnackbar({ msg: 'Cookbook created!', state: 'success' })
          setModalOpen(false)
        }
      } else {
        setSnackbar({ msg: 'Your cookbook needs a name!', state: 'error' })
      }
    } catch (e) {
      handleServerError(e)
    }
  }

  return (
    <Modal modalOpen={modalOpen} type='create-cookbook' closeModal={() => setModalOpen(false)}>
      <Style>
        <h1>Create a New Cookbook</h1>
        <form autoComplete='off' onSubmit={e => handleSubmit(e)}>
          <label htmlFor='name'>
            <div>
              <input
                autoFocus
                placeholder='Name Your Cookbook...'
                type='text'
                name='name'
                ref={nameFieldRef}
              />
              {/* For enter key */}
              <input type='submit' hidden />
            </div>
          </label>
          <button type='submit'>Create Cookbook</button>
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
  background-color: ${({ theme }) => theme.mainBackgroundColor};
  ${ModalHeaderMixin}
  form {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px;
    ${ModalBtnMixin}
    label {
      width: 100%;
      div {
        ${ModalFieldMixin}
      }
    }
  }
`

export default AddCookbookModal
