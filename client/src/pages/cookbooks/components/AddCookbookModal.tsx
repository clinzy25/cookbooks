import React, { useRef, FormEvent, FC } from 'react'
import styled from 'styled-components'
import { useUser } from '@auth0/nextjs-auth0/client'
import { api } from '@/api'
import axios from 'axios'
import useAppContext from '@/context/app.context'
import { IAppContext } from '@/types/@types.context'
import Modal from '@/components/Modal'
import { useRouter } from 'next/router'
import { ICookbookReq } from '@/types/@types.cookbooks'
import { BREAKPOINT_MOBILE } from '@/utils/utils.constants'
import { modalBtnMixin, modalFieldMixin, modalHeaderMixin } from '@/styles/mixins'

type Props = {
  setModalOpen: (bool: boolean) => void
}

const AddCookbookModal: FC<Props> = ({ setModalOpen }) => {
  const { setSnackbar, revalidateCookbooks, handleServerError } =
    useAppContext() as IAppContext
  const router = useRouter()
  const { user } = useUser()
  const nameFieldRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (nameFieldRef.current?.value && user?.sub) {
        const cookbook: ICookbookReq = {
          cookbook_name: nameFieldRef.current.value,
          creator_user_guid: user.sub,
        }
        const res = await axios.post(`${api}/cookbooks`, cookbook)
        if (res.status === 201) {
          revalidateCookbooks()
          setSnackbar({ msg: 'Cookbook created!', state: 'success' })
          setModalOpen(false)
          router.push(`/cookbooks/${res.data}`)
        }
      } else {
        setSnackbar({ msg: 'Your cookbook needs a name', state: 'error' })
      }
    } catch (e) {
      handleServerError(e)
    }
  }

  return (
    <Modal closeModal={() => setModalOpen(false)}>
      <Style BREAKPOINT_MOBILE={BREAKPOINT_MOBILE}>
        <h2>Create a New Cookbook</h2>
        <form autoComplete='off' onSubmit={e => handleSubmit(e)}>
          <div />
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
              <button type='submit'>Create Cookbook</button>
            </div>
          </label>
        </form>
      </Style>
    </Modal>
  )
}

type StyleProps = {
  BREAKPOINT_MOBILE: number
}

const Style = styled.div<StyleProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  ${modalHeaderMixin}
  form {
    width: 100%;
    height: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
    label {
      width: 80%;
      div {
        display: flex;
        margin-top: 10px;
        ${modalFieldMixin}
        ${modalBtnMixin}
      }
    }
  }
  @media screen and (max-width: ${props => props.BREAKPOINT_MOBILE}px) {
    form {
      label {
        width: 100%;
      }
    }
  }
`

export default AddCookbookModal
