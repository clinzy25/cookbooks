import useAppContext from '@/context/app.context'
import { IAppContext, ITag } from '@/types/@types.context'
import Link from 'next/link'
import React, { FC, FocusEvent, KeyboardEvent, useEffect, useState } from 'react'
import { AiOutlineEdit, AiOutlineUndo } from 'react-icons/ai'
import { CgClose } from 'react-icons/cg'
import { BsCheckLg } from 'react-icons/bs'
import styled from 'styled-components'
import { serverErrorMessage } from '@/utils/utils.errors.server'
import { api } from '@/api'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useUser } from '@auth0/nextjs-auth0/client'
import { IEditTagRes } from '@/types/@types.tags'
import Loader from './Loader'

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
  const [submitTrigger, setSubmitTrigger] = useState(false)

  const handleQueEdits = (
    e: FocusEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>,
    tag: ITag
  ) => {
    const newTagName = e.currentTarget.textContent
    if (!newTagName) {
      setSnackbar({
        msg: 'Tag name cannot be empty',
        state: 'error',
        duration: 3000,
      })
    } else if (newTagName.length > 50) {
      setSnackbar({
        msg: 'Tag name is too long',
        state: 'error',
        duration: 3000,
      })
    } else if (newTagName !== tag.tag_name) {
      const newTag = {
        ...tag,
        new_tag_name: newTagName,
      }
      setTagsToEdit([...tagsToEdit, newTag])
      if (e.type === 'keydown') setSubmitTrigger(true)
    } else {
      setEditMode(false)
    }
  }

  const handleQueDeletes = (tag: ITag) => setTagsToDelete([...tagsToDelete, tag])

  const handleUndo = (tag: ITag) => setTagsToDelete(tagsToDelete.filter(t => t !== tag))

  const handleDelete = async () => {
    const body = {
      tags: tagsToDelete,
      cookbook_guid: currentCookbook?.guid,
    }
    const { data } = await axios.delete(`${api}/tags`, { data: body })
    return tags.filter(t => !data.includes(t.tag_name))
  }

  const handleEdit = async () => {
    const body = {
      tags: tagsToEdit,
      cookbook_guid: currentCookbook?.guid,
    }
    const { data } = await axios.patch(`${api}/tags`, body)
    const editedTags = tags.map(t => {
      const isEdited = data.find((tt: IEditTagRes) => tt.old_tag_name === t.tag_name)
      return isEdited ? { ...t, tag_name: isEdited.tag_name } : t
    })
    return editedTags
  }

  const handleSubmit = async () => {
    try {
      const options = {
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      }
      if (tagsToEdit.length) {
        const optimisticData = tags.map(t => {
          const editedTag = tagsToEdit.find(tt => tt.tag_name === t.tag_name)
          if (editedTag) {
            return { ...t, tag_name: editedTag.new_tag_name }
          }
          return t
        })
        await revalidateTags(handleEdit, {
          optimisticData,
          ...options,
        })
      }
      if (tagsToDelete.length) {
        await revalidateTags(handleDelete, {
          optimisticData: tags.filter(t => !tagsToDelete.includes(t)),
          ...options,
        })
      }
      setSnackbar({
        msg: 'Tags updated',
        state: 'success',
        duration: 3000,
      })
      setEditMode(false)
      setTagsToDelete([])
      setTagsToEdit([])
    } catch (e) {
      serverErrorMessage(e, setSnackbar)
    }
  }

  useEffect(() => {
    const allowEdit =
      pathname === '/cookbooks/[id]' && currentCookbook?.creator_user_guid === user?.sub
    setAllowEdit(allowEdit)
  }, [currentCookbook]) // eslint-disable-line

  useEffect(() => {
    if (submitTrigger) {
      handleSubmit()
      setSubmitTrigger(false)
    }
  }, [submitTrigger]) // eslint-disable-line

  if (!tags) {
    return <Loader size={20} />
  }
  if (tagsError) {
    return <p>Error loading tags</p>
  }
  return (
    <Style>
      {tags?.map((t: ITag) =>
        allowEdit && editMode ? (
          <div key={t.guid} className={`tag ${tagsToDelete.includes(t) && 'deleted'}`}>
            {tagsToDelete.includes(t) ? (
              <AiOutlineUndo onClick={() => handleUndo(t)} className='icon' />
            ) : (
              <CgClose onClick={() => handleQueDeletes(t)} className='icon' />
            )}
            <div
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleQueEdits(e, t)
                }
              }}
              onBlur={e => handleQueEdits(e, t)}
              contentEditable>
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
          <BsCheckLg onClick={handleSubmit} className='icon edit-icon' />
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
