import { fetcher } from '@/api'
import { api } from '@/api'
import Modal from '@/components/Modal'
import useAppContext from '@/context/app.context'
import {
  AvatarMixin,
  ModalBtnMixin,
  ModalFieldMixin,
  ModalHeaderMixin,
  PlannedFeatureMixin,
} from '@/styles/mixins'
import { IAppContext } from '@/types/@types.context'
import { IMemberRes } from '@/types/@types.user'
import { validateEmail } from '@/utils/utils.validateField'
import axios from 'axios'
import moment from 'moment'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { FC, MouseEvent, MutableRefObject, useEffect, useRef, useState } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { BsCheckLg, BsFillPersonPlusFill, BsFillSendFill } from 'react-icons/bs'
import { FaBirthdayCake } from 'react-icons/fa'
import styled from 'styled-components'
import useSWR from 'swr'
import packageJson from '../../../../../package.json'

type Props = {
  setEditModal: (bool: boolean) => void
  editModal: boolean
}

const EditCookbookModal: FC<Props> = ({ setEditModal }) => {
  const {
    query,
    query: { cookbook, cookbook_name },
    replace,
  } = useRouter()
  const router = useRouter()
  const {
    setSnackbar,
    handleServerError,
    revalidateCookbooks,
    setTagsEditMode,
    tagsEditMode,
  } = useAppContext() as IAppContext
  const [members, setMembers] = useState<IMemberRes[]>([])
  const [pendingInvites, setPendingInvites] = useState<IMemberRes[]>([])
  const [confirm, setConfirm] = useState(false)
  const emailRef = useRef() as MutableRefObject<HTMLInputElement>
  const nameRef = useRef<HTMLInputElement>(null)

  const {
    data,
    error,
    mutate: revalidatePeople,
  } = useSWR(`${api}/users/cookbook?cookbook_guid=${cookbook}`, fetcher)

  const handleEditName = async () => {
    try {
      const newName = nameRef.current?.value
      if (!nameRef.current?.value) {
        setSnackbar({ msg: 'Cookbook must have a name', state: 'error' })
      } else if (newName !== decodeURIComponent(cookbook_name?.toString() as string)) {
        const body = {
          cookbook_name: newName,
          cookbook_guid: cookbook,
        }
        const res = await axios.patch(`${api}/cookbooks`, body)
        if (res.status === 204) {
          setSnackbar({ msg: 'Cookbook updated', state: 'success' })
        }
        revalidateCookbooks()
        replace({ query: { ...query, cookbook_name: newName } }, undefined, { shallow: true })
      }
    } catch (e) {
      handleServerError(e)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${api}/cookbooks?cookbook_guid=${cookbook}`)
      if (res.status === 200) {
        setSnackbar({ msg: 'Cookbook deleted', state: 'success' })
        router.push('/cookbooks')
        revalidateCookbooks()
      }
    } catch (e) {
      handleServerError(e)
    }
  }

  const sendInvite = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const isValidInput = !emailRef.current || !validateEmail(emailRef.current.value)
    const duplicateEmail = pendingInvites.some(
      invite => invite.email === emailRef.current.value
    )

    if (isValidInput) {
      setSnackbar({ msg: 'Invalid email', state: 'error' })
    } else if (duplicateEmail) {
      setSnackbar({ msg: "You've already sent this person an invite!", state: 'error' })
    } else {
      const invites = [
        {
          email: emailRef.current.value,
          cookbook_guid: cookbook,
        },
      ]
      try {
        const res = await axios.post(`${api}/users/invite`, { invites })
        if (res.status === 201) {
          revalidatePeople()
          setSnackbar({ msg: 'Invitation Sent!', state: 'success' })
        }
      } catch (e) {
        handleServerError(e)
      }
    }
  }

  useEffect(() => {
    data?.members && setMembers(data.members)
    data?.pending_invites && setPendingInvites(data.pending_invites)
  }, [data])

  return (
    <Modal type='edit-cookbook' closeModal={() => setEditModal(false)}>
      <Style tagsEditMode={tagsEditMode}>
        <h2>Edit Cookbook</h2>
        <label htmlFor='cookbook-name'>
          <h3>Edit Cookbook Name</h3>
          <div>
            <input
              type='text'
              name='cookbook-name'
              ref={nameRef}
              defaultValue={decodeURIComponent(cookbook_name?.toString() as string)}
              onKeyDown={e => e.key === 'Enter' && handleEditName()}
            />
            <button onClick={handleEditName}>Update</button>
          </div>
        </label>
        <h3>Edit Tags</h3>
        <button
          type='button'
          id='edit-tags-btn'
          onClick={() => setTagsEditMode(!tagsEditMode)}>
          {tagsEditMode ? (
            <BsCheckLg title='Submit Tag Edits' className='icon edit-icon' />
          ) : (
            <AiOutlineEdit className='edit-icon' />
          )}
          Edit Tags
        </button>
        <h3>People</h3>
        {packageJson.version !== '1.2.0' ? (
          <div className='feature'>
            <p>Membership and invites coming soon!</p>
            <BsFillPersonPlusFill className='feature-icon' />
          </div>
        ) : (
          <>
            <label htmlFor='email'>
              <h4>Send invitation</h4>
              <div>
                <input
                  name='email'
                  ref={emailRef}
                  placeholder='Type an email address'
                  type='text'
                />
                <button type='submit' onClick={e => sendInvite(e)}>
                  Send invite
                </button>
              </div>
            </label>
            <h4>Cookbook Members</h4>
            <ul>
              {error ? (
                'error'
              ) : members.length ? (
                members.map(m => (
                  <li key={m.membership_guid}>
                    <div>
                      <Image
                        src='/assets/avatar-placeholder.png'
                        width={25}
                        height={25}
                        alt={m.username}
                      />
                      <span>{m.username}</span>
                      <span className='email'>{m.email}</span>
                    </div>
                    <span className='date'>
                      <FaBirthdayCake className='icon' />{' '}
                      {moment(m.created_at).format('M/D/YY')}
                    </span>
                  </li>
                ))
              ) : (
                <p>No members. Invite some people!</p>
              )}
            </ul>
            <h4>Pending Invitations</h4>
            <ul>
              {error ? (
                'error'
              ) : pendingInvites.length ? (
                pendingInvites.map(m => (
                  <li key={m.membership_guid}>
                    <div>
                      <Image
                        src='/assets/avatar-placeholder.png'
                        width={25}
                        height={25}
                        alt={m.username}
                      />
                      <span className='email'>{m.email}</span>
                    </div>
                    <span className='date'>
                      <BsFillSendFill className='icon' />{' '}
                      {moment(m.created_at).format('M/D/YY')}
                    </span>
                    <button>Revoke</button>
                  </li>
                ))
              ) : (
                <p>No pending invites.</p>
              )}
            </ul>
          </>
        )}
        <div>
          <h3>Delete Cookbook</h3>
          {!confirm ? (
            <button id='delete-btn' onClick={() => setConfirm(true)}>
              Delete
            </button>
          ) : (
            <div className='confirmation-ctr'>
              <p>Are you sure you want to delete this cookbook?</p>
              <button type='button' onClick={handleDelete}>
                Yes
              </button>
              <button type='button' onClick={() => setConfirm(false)}>
                No
              </button>
            </div>
          )}
        </div>
      </Style>
    </Modal>
  )
}

type StyleProps = {
  tagsEditMode: boolean
}

const Style = styled.article<StyleProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  background-color: ${({ theme }) => theme.mainBackgroundColor};
  ${ModalHeaderMixin}
  ${ModalFieldMixin}
  ${ModalBtnMixin}
  h3 {
    margin: 10px 0 5px 0;
  }
  label {
    div {
      display: flex;
      margin-top: 5px;
      input {
        width: 50%;
      }
    }
  }
  h2 {
    margin-bottom: 0;
    &:not(h2:first-of-type) {
      margin-top: 30px;
    }
  }
  #edit-tags-btn {
    margin-left: 0;
    display: flex;
    align-items: center;
    background-color: ${props =>
      props.tagsEditMode ? props.theme.successColor : props.theme.buttonBackground};
    .edit-icon {
      font-size: 1.3rem;
      margin-right: 5px;
    }
    ${props =>
      props.tagsEditMode &&
      `
      animation: pulse 0.5s infinite;
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.08);
        }
        100% {
          transform: scale(1);
        }
      }
      
    `}
  }
  ul {
    list-style-type: none;
    text-align: center;
    background-color: ${({ theme }) => theme.secondaryBackgroundColor};
    border-radius: 10px;
    padding: 10px;
    max-height: 200px;
    min-height: 43px;
    overflow-y: auto;
    li {
      background-color: ${({ theme }) => theme.mainBackgroundColor};
      letter-spacing: 0.5px;
      margin: 3px 0;
      white-space: nowrap;
      button {
        border-radius: 25px;
        padding: 4px 12px;
        background-color: ${({ theme }) => theme.errorColor};
        color: ${({ theme }) => theme.mainLightTextColor};
      }
      img {
        ${AvatarMixin}
      }
      div {
        display: flex;
        align-items: center;
        overflow: hidden;
        span {
          margin: 0 10px;
        }
        .email {
          display: inline-block;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
      .date {
        display: flex;
        align-items: center;
        margin-left: auto;
        text-align: left;
        .icon {
          margin-right: 5px;
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
  #delete-btn {
    margin: 0;
    background-color: ${({ theme }) => theme.errorColor};
    color: ${({ theme }) => theme.mainLightTextColor};
  }
  .confirmation-ctr {
    button:first-of-type {
      margin-left: 0;
    }
  }
  ${PlannedFeatureMixin}
  @media screen and (max-width: ${({ theme }) => theme.breakpointMobile}px) {
    label {
      div {
        input {
          width: 100%;
        }
      }
    }
    ul {
      font-size: 0.9rem;
    }
  }
`

export default EditCookbookModal
