import { fetcher } from '@/api'
import { api } from '@/api'
import Modal from '@/components/Modal'
import useAppContext from '@/context/app.context'
import { IAppContext } from '@/types/@types.context'
import { IMemberRes } from '@/types/@types.user'
import { serverErrorMessage } from '@/utils/utils.errors.server'
import { validateEmail } from '@/utils/utils.validateField'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { FC, MouseEvent, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'

type Props = {
  setEditModal: (bool: boolean) => void
}

const EditCookbookModal: FC<Props> = ({ setEditModal }) => {
  const {
    query: { id },
  } = useRouter()
  const router = useRouter()
  const { setSnackbar, currentCookbook, revalidateCookbooks } = useAppContext() as IAppContext
  const [members, setMembers] = useState<IMemberRes[]>([])
  const [pendingInvites, setPendingInvites] = useState<IMemberRes[]>([])
  const [formError, setFormError] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)

  const nameRef = useRef<HTMLInputElement>(null)

  const {
    data,
    error,
    mutate: revalidatePeople,
  } = useSWR(`${api}/users/cookbook?cookbook_guid=${id}`, fetcher)

  const handleEditName = async () => {
    try {
      const newName = nameRef.current?.value
      if (!nameRef.current?.value) {
        setSnackbar({
          msg: 'Cookbook must have a name',
          state: 'error',
          duration: 3000,
        })
      } else if (newName !== currentCookbook?.cookbook_name) {
        const body = {
          cookbook_name: newName,
          cookbook_guid: currentCookbook?.guid,
        }
        const res = await axios.patch(`${api}/cookbooks`, body)
        if (res.status === 204) {
          setSnackbar({
            msg: 'Cookbook updated',
            state: 'success',
            duration: 3000,
          })
        }
        revalidateCookbooks()
      }
    } catch (e) {
      serverErrorMessage(e, setSnackbar)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${api}/cookbooks?cookbook_guid=${currentCookbook?.guid}`)
      if (res.status === 200) {
        setSnackbar({
          msg: 'Cookbook deleted',
          state: 'success',
          duration: 3000,
        })
        router.push('/cookbooks')
        revalidateCookbooks()
      }
    } catch (e) {
      serverErrorMessage(e, setSnackbar)
    }
  }

  const sendInvite = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const isValidInput = !emailRef.current || !validateEmail(emailRef.current.value)
    if (isValidInput) {
      setFormError(true)
    } else {
      formError && setFormError(false)
      const invites = [
        {
          email: emailRef.current.value,
          cookbook_guid: id,
        },
      ]
      try {
        const res = await axios.post(`${api}/users/invite`, { invites })
        if (res.status === 201) {
          revalidatePeople()
          setSnackbar({
            msg: 'Invitation Sent!',
            state: 'success',
            duration: 3000,
          })
        }
      } catch (e) {
        serverErrorMessage(e, setSnackbar)
      }
    }
  }

  useEffect(() => {
    data?.data.members && setMembers(data.data.members)
    data?.data.pending_invites && setPendingInvites(data.data.pending_invites)
  }, [data])

  return (
    <Modal closeModal={() => setEditModal(false)}>
      <Style>
        <header>
          <h1>Edit Cookbook</h1>
        </header>
        <label htmlFor='cookbook-name'>
          <h2>Edit Cookbook Name</h2>
          <input
            type='text'
            name='cookbook-name'
            ref={nameRef}
            defaultValue={currentCookbook?.cookbook_name}
            onKeyDown={e => e.key === 'Enter' && handleEditName()}
          />
          <button onClick={handleEditName}>Update</button>
        </label>
        <h2>People</h2>
        <h3>Send invitation</h3>
        <form>
          <input ref={emailRef} placeholder='Type an email address' type='text' />
          <button type='submit' onClick={e => sendInvite(e)}>
            Send invite
          </button>
          {formError && <p id='form-error'>Invalid email</p>}
        </form>
        <h3>Cookbook Members</h3>
        {error ? (
          'error'
        ) : (
          <ul>
            {members.map(m => (
              <li key={m.membership_guid}>
                <div>
                  <Image
                    src='/assets/avatar-placeholder.png'
                    width={25}
                    height={25}
                    alt={m.username}
                  />
                  <span>{m.username}</span>
                  <span>{m.email}</span>
                </div>
                <span>Joined: {m.created_at}</span>
              </li>
            ))}
          </ul>
        )}
        <h3>Pending Invitations</h3>
        <ul>
          {error
            ? 'error'
            : pendingInvites.map(m => (
                <li key={m.membership_guid}>
                  <div>
                    <Image
                      src='/assets/avatar-placeholder.png'
                      width={25}
                      height={25}
                      alt={m.username}
                    />
                    <span>{m.username}</span>
                    <span>{m.email}</span>
                  </div>
                  <span>Sent: {m.created_at}</span>
                </li>
              ))}
        </ul>
        <h2>Delete Cookbook</h2>
        {!confirm ? (
          <button onClick={() => setConfirm(true)}>Delete</button>
        ) : (
          <>
            <p>Are you sure you want to delete this cookbook?</p>
            <button type='button' onClick={handleDelete}>
              Yes
            </button>
            <button type='button' onClick={() => setConfirm(false)}>
              No
            </button>
          </>
        )}
      </Style>
    </Modal>
  )
}

const Style = styled.article`
  height: 100%;
  padding: 20px 40px;
  header {
    text-align: center;
    width: 100%;
    font-size: 1.4rem;
  }
  input {
    height: 48px;
    width: 40%;
  }
  button {
    padding: 15px 30px;
    margin-left: 15px;
    width: min-content;
    white-space: nowrap;
    border: 1px solid gray;
    border-radius: 10px;
  }
  form {
    #form-error {
      color: red;
      height: 22px;
    }
  }
  h2 {
    margin-bottom: 5px;
    &:not(h2:first-of-type) {
      margin-top: 30px;
    }
  }
  ul {
    list-style-type: none;
    li {
      img {
        border-radius: 25px;
      }
      div {
        display: flex;
        align-items: center;
        span {
          margin: 0 10px;
        }
      }
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid gray;
      border-radius: 25px;
      padding: 5px;
    }
  }
`

export default EditCookbookModal
