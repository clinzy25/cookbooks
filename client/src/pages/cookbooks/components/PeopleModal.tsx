import { fetcher } from '@/api'
import { api } from '@/api'
import Modal from '@/components/Modal'
import useAppContext from '@/context/app.context'
import { AppContextType } from '@/types/@types.context'
import { IMemberResult } from '@/types/@types.user'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'

type Props = {
  setPeopleModal: (bool: boolean) => void
}

const PeopleModal = ({ setPeopleModal }: Props) => {
  const { currentCookbook } = useAppContext() as AppContextType
  const [members, setMembers] = useState<IMemberResult[]>([])
  const [pendingInvites, setPendingInvites] = useState<IMemberResult[]>([])
  const emailRef = useRef(null)

  const {
    data,
    error,
    mutate: revalidatePeople,
  } = useSWR(`${api}/users/cookbook?cookbook_guid=${currentCookbook?.guid}`, fetcher)

  const sendInvite = () => {
    return
  }

  useEffect(() => {
    data?.members && setMembers(data.members)
    data?.pending_invites && setPendingInvites(data.pending_invites)
  }, [data])

  return (
    <Modal closeModal={() => setPeopleModal(false)}>
      <Style>
        <h1>Send invitation</h1>
        <input ref={emailRef} placeholder='Type an email address' type='text' />
        <button onClick={sendInvite}>Send invite</button>
        <h1>Cookbook Members</h1>
        {error ? (
          'error'
        ) : (
          <ul>
            {members.map(m => (
              <li key={m.membership_guid}>{m.username}</li>
            ))}
          </ul>
        )}
        <h1>Pending Invitations</h1>
        <ul>
          {error
            ? 'error'
            : pendingInvites.map(m => <li key={m.membership_guid}>{m.username}</li>)}
        </ul>
      </Style>
    </Modal>
  )
}

const Style = styled.article``

export default PeopleModal
