import useAppContext from '@/context/app.context'
import { IAppContext, ITag } from '@/types/@types.context'
import Link from 'next/link'
import React, { FC, FocusEvent, useEffect, useState } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { CgClose } from 'react-icons/cg'
import { BsCheckLg } from 'react-icons/bs'
import styled from 'styled-components'
import { serverErrorMessage } from '@/utils/utils.errors.server'
import { api } from '@/api'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useUser } from '@auth0/nextjs-auth0/client'

const TagList: FC = () => {
  const { pathname } = useRouter()
  const { user } = useUser()
  const { tags, tagsError, setSnackbar, revalidateTags, currentCookbook } =
    useAppContext() as IAppContext

  const [allowEdit, setAllowEdit] = useState(
    pathname === '/cookbooks[id]' && currentCookbook?.creator_user_guid === user?.sub
  )
  const [editMode, setEditMode] = useState(false)
  const [tagsToDelete, setTagsToDelete] = useState<ITag[]>([])
  const [tagsToEdit, setTagsToEdit] = useState<ITag[]>([])

  const handleEdit = (e: FocusEvent<HTMLDivElement>, tag: ITag) => {
    if (e.currentTarget.textContent) {
      const newTag = {
        ...tag,
        new_tag_name: e.currentTarget.textContent,
      }
      setTagsToEdit([...tagsToEdit, newTag])
    }
  }

  const handleDelete = (tag: ITag) => setTagsToDelete([...tagsToDelete, tag])

  const handleSubmit = async () => {
    try {
      if (tagsToDelete.length) {
        const body = {
          tags: tagsToDelete,
          cookbook_guid: currentCookbook?.guid,
        }
        const res = await axios.delete(`${api}/tags`, { data: body })
        if (res.status === 200) {
          setSnackbar({
            msg: 'Tags deleted',
            state: 'success',
            duration: 3000,
          })
        }
      }
      if (tagsToEdit.length) {
        const body = {
          tags: tagsToEdit,
          cookbook_guid: currentCookbook?.guid,
        }
        const res = await axios.patch(`${api}/tags`, body)
        if (res.status === 204) {
          setSnackbar({
            msg: 'Tags updated',
            state: 'success',
            duration: 3000,
          })
        }
      }
      revalidateTags()
    } catch (e) {
      serverErrorMessage(e, setSnackbar)
    }
  }

  useEffect(() => {
    if (!editMode) {
      handleSubmit()
      setTagsToDelete([])
      setTagsToEdit([])
    }
  }, [editMode]) // eslint-disable-line

  useEffect(() => {
    const allowEdit =
      pathname === '/cookbooks/[id]' && currentCookbook?.creator_user_guid === user?.sub
    setAllowEdit(allowEdit)
  }, [currentCookbook]) // eslint-disable-line

  return (
    <Style>
      {tagsError
        ? 'Error loading tags'
        : tags?.map((t: ITag) =>
            allowEdit && editMode ? (
              <div key={t.guid} className={`tag ${tagsToDelete.includes(t) ? 'deleted' : ''}`}>
                <CgClose onClick={() => handleDelete(t)} className='icon' />
                <div onBlur={e => handleEdit(e, t)} contentEditable>
                  {t.tag_name}
                </div>
              </div>
            ) : (
              <Link href={`/search/recipes/${t.tag_name}`} className='tag' key={t.guid}>
                #{t.tag_name}
              </Link>
            )
          )}
      {allowEdit ? (
        editMode ? (
          <BsCheckLg onClick={() => setEditMode(false)} className='icon edit-icon' />
        ) : (
          <AiOutlineEdit onClick={() => setEditMode(true)} className='icon edit-icon' />
        )
      ) : null}
    </Style>
  )
}

const Style = styled.div`
  display: flex;
  align-items: center;
  overflow-y: hidden;
  white-space: nowrap;
  height: 40px;
  scrollbar-width: thin;
  .tag {
    display: flex;
    align-items: center;
    border: 1px solid gray;
    margin: 0 5px;
    padding: 0 7px;
    border-radius: 25px;
  }
  .deleted {
    text-decoration: line-through;
    background-color: gray;
  }
  input {
    border: 0;
    border-radius: 25px;
    font-size: 0.9rem;
    height: 24px;
    outline: 0;
  }
  .edit-icon {
    font-size: 1.6rem;
  }
  .icon {
    cursor: pointer;
  }
`

export default TagList
