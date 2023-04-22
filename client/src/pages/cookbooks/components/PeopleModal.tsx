import { fetcher } from '@/api'
import { api } from '@/api'
import Modal from '@/components/Modal'
import useAppContext from '@/context/app.context'
import { AppContextType } from '@/types/@types.context'
import { IMemberResult } from '@/types/@types.user'
import { serverErrorMessage } from '@/utils/utils.errors.server'
import { validateEmail } from '@/utils/utils.validateField'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { MouseEvent, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'

type Props = {
  setPeopleModal: (bool: boolean) => void
}

const PeopleModal = ({ setPeopleModal }: Props) => {
  const {
    query: { id },
  } = useRouter()
  const { setSnackbar } = useAppContext() as AppContextType
  const [members, setMembers] = useState<IMemberResult[]>([])
  const [pendingInvites, setPendingInvites] = useState<IMemberResult[]>([])
  const [formError, setFormError] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)

  const {
    data,
    error,
    mutate: revalidatePeople,
  } = useSWR(`${api}/users/cookbook?cookbook_guid=${id}`, fetcher)

  const sendInvite = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!emailRef.current || !validateEmail(emailRef.current.value)) {
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
    data?.members && setMembers(data.members)
    data?.pending_invites && setPendingInvites(data.pending_invites)
  }, [data])

  return (
    <Modal closeModal={() => setPeopleModal(false)}>
      <Style>
        <header>
          <h1>People</h1>
        </header>
        <h2>Send invitation</h2>
        <form>
          <input ref={emailRef} placeholder='Type an email address' type='text' />
          <button type='submit' onClick={e => sendInvite(e)}>
            Send invite
          </button>
          {formError && <p id='form-error'>Invalid email</p>}
        </form>
        <h2>Cookbook Members</h2>
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
        <h2>Pending Invitations</h2>
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
  form {
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

export default PeopleModal
