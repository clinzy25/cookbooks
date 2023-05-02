import useAppContext from '@/context/app.context'
import { IAppContext } from '@/types/@types.context'
import Link from 'next/link'
import React, { FC, FocusEvent, KeyboardEvent, useEffect, useState } from 'react'
import { AiOutlineEdit, AiOutlineUndo } from 'react-icons/ai'
import { CgClose } from 'react-icons/cg'
import { BsCheckLg } from 'react-icons/bs'
import styled from 'styled-components'
import { api } from '@/api'
import axios from 'axios'
import { useRouter } from 'next/router'
import Loader from './Loader'
import { IEditTag, ITag } from '@/types/@types.tags'

const TagList: FC = () => {
  const {
    query: { cookbook },
  } = useRouter()
  const {
    tags,
    tagsError,
    setSnackbar,
    handleServerError,
    revalidateTags,
    isCookbookCreator,
  } = useAppContext() as IAppContext

  const [editMode, setEditMode] = useState(false)
  const [tagsToDelete, setTagsToDelete] = useState<ITag[]>([])
  const [tagsToEdit, setTagsToEdit] = useState<IEditTag[]>([])
  const [submitTrigger, setSubmitTrigger] = useState(false)

  const verifyNewTagName = (newTagName: string | null, oldTagName: string) => {
    if (!newTagName) {
      setSnackbar({ msg: 'Tag name cannot be empty', state: 'error' })
      return false
    } else if (newTagName.length > 50) {
      setSnackbar({ msg: 'Tag name is too long', state: 'error' })
      return false
    } else if (newTagName !== oldTagName) {
      return true
    }
  }

  const handleQueEdits = (
    e: FocusEvent<HTMLSpanElement> | KeyboardEvent<HTMLSpanElement>,
    tag: ITag
  ) => {
    const newTagName = e.currentTarget.textContent
    const isValidTag = verifyNewTagName(newTagName, tag.tag_name)
    if (isValidTag && newTagName) {
      const newTag = {
        ...tag,
        new_tag_name: newTagName,
      }
      setTagsToEdit([...tagsToEdit, newTag])
      e.type === 'keydown' && setSubmitTrigger(true)
    } else {
      e.currentTarget.textContent = tag.tag_name
    }
  }

  const handleEnterKey = (e: KeyboardEvent<HTMLSpanElement>, t: ITag) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleQueEdits(e, t)
    }
  }

  const handleQueDeletes = (tag: ITag) => setTagsToDelete([...tagsToDelete, tag])

  const handleUndo = (tag: ITag) => setTagsToDelete(tagsToDelete.filter(t => t !== tag))

  const handleSubmitEdits = async () => {
    const optimisticData = tags.map(t => {
      const editedTag = tagsToEdit.find(tt => tt.tag_name === t.tag_name)
      return editedTag ? { ...t, tag_name: editedTag.new_tag_name } : t
    })
    revalidateTags(optimisticData, false)
    const body = {
      tags: tagsToEdit,
      cookbook_guid: cookbook,
    }
    await axios.patch(`${api}/tags`, body)
  }

  const handleSubmitDeletes = async () => {
    const optimisticData = tags.filter(t => !tagsToDelete.includes(t))
    revalidateTags(optimisticData, false)
    const body = {
      tags: tagsToDelete,
      cookbook_guid: cookbook,
    }
    await axios.delete(`${api}/tags`, { data: body })
  }

  const handleSubmit = async () => {
    try {
      if (tagsToEdit.length) {
        await handleSubmitEdits()
      }
      if (tagsToDelete.length) {
        await handleSubmitDeletes()
      }
      if (tagsToDelete.length || tagsToEdit.length) {
        revalidateTags()
        setSnackbar({ msg: 'Tags updated', state: 'success' })
      }
      setEditMode(false)
      setSubmitTrigger(false)
      setTagsToDelete([])
      setTagsToEdit([])
    } catch (e) {
      handleServerError(e)
    }
  }

  useEffect(() => {
    submitTrigger && handleSubmit()
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
        editMode ? (
          <div key={t.guid} className={`tag ${tagsToDelete.includes(t) && 'deleted'}`}>
            {tagsToDelete.includes(t) ? (
              <AiOutlineUndo onClick={() => handleUndo(t)} className='icon' />
            ) : (
              <CgClose onClick={() => handleQueDeletes(t)} className='icon' />
            )}
            <span
              onKeyDown={e => handleEnterKey(e, t)}
              suppressContentEditableWarning={true}
              spellCheck={false}
              onBlur={e => handleQueEdits(e, t)}
              contentEditable>
              {t.tag_name}
            </span>
          </div>
        ) : (
          <Link
            href={
              cookbook ? `/cookbooks/${cookbook}/search/${t.tag_name}` : `search/${t.tag_name}`
            }
            className='tag'
            key={t.guid}>
            #{t.tag_name}
          </Link>
        )
      )}
      {cookbook && isCookbookCreator ? (
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
    min-width: 40px;
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
