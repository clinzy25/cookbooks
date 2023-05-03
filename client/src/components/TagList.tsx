import useAppContext from '@/context/app.context'
import { IAppContext } from '@/types/@types.context'
import Link from 'next/link'
import React, { FC, FocusEvent, KeyboardEvent, useEffect, useState } from 'react'
import { AiOutlineEdit, AiOutlineUndo } from 'react-icons/ai'
import { IoMdClose } from 'react-icons/io'
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
    <Style editMode={editMode}>
      <div className='scroll-ctr'>
        {tags?.map((t: ITag) =>
          editMode ? (
            <div key={t.guid} className={`tag ${tagsToDelete.includes(t) && 'deleted'}`}>
              {tagsToDelete.includes(t) ? (
                <AiOutlineUndo
                  title='Undo Delete'
                  onClick={() => handleUndo(t)}
                  className='icon undo-icon'
                />
              ) : (
                <IoMdClose
                  title='Delete Tag'
                  onClick={() => handleQueDeletes(t)}
                  className='icon delete-icon'
                />
              )}
              <span
                onKeyDown={e => handleEnterKey(e, t)}
                suppressContentEditableWarning={true}
                spellCheck={false}
                onBlur={e => handleQueEdits(e, t)}
                contentEditable={!tagsToDelete.includes(t)}>
                {t.tag_name}
              </span>
            </div>
          ) : (
            <Link
              href={
                cookbook
                  ? `/cookbooks/${cookbook}/search/${t.tag_name}`
                  : `search/${t.tag_name}`
              }
              className='tag'
              key={t.guid}>
              <span className='hash'>#</span>
              {t.tag_name}
            </Link>
          )
        )}
      </div>
      {cookbook && isCookbookCreator ? (
        editMode ? (
          <BsCheckLg
            title='Submit Tag Edits'
            onClick={handleSubmit}
            className='icon edit-icon'
          />
        ) : (
          <AiOutlineEdit
            title='Edit Tags'
            onClick={() => setEditMode(true)}
            className='icon edit-icon'
          />
        )
      ) : null}
    </Style>
  )
}

type StyleProps = {
  editMode: boolean
}

const Style = styled.div<StyleProps>`
  display: flex;
  align-items: center;
  width: 100%;
  overflow-x: hidden;
  margin: 0 20px;
  .scroll-ctr {
    display: flex;
    align-items: center;
    position: relative;
    overflow-x: scroll;
    white-space: nowrap;
    height: 40px;
    scrollbar-width: thin;
    .tag {
      display: flex;
      align-items: center;
      border: 1px solid ${({ theme }) => theme.softBorder};
      background-color: ${({ theme }) => theme.tagColor};
      margin: 0 5px;
      padding: 0 7px;
      border-radius: 25px;
      font-family: 'DM Mono', monospace;
      box-shadow: 2px 2px 2px #d2d2d2;
      transition: all 0.1s ease-out;
      &:hover {
        text-decoration: underline;
        transition: all 0.1s ease-out;
      }
      .hash {
        margin: 0 3px 0 3px;
      }
    }
    .icon {
      font-size: 1rem;
      font-weight: 900;
      border-radius: 25px;
      &:hover {
        color: white;
        background-color: #696969;
      }
    }
    .undo-icon {
      &:hover {
        background-color: #a2a2a2;
      }
    }
    .deleted {
      text-decoration: line-through;
      background-color: #4c4c4c;
      color: white;
      &:hover {
        text-decoration: line-through;
      }
    }
    input {
      border: 0;
      border-radius: 25px;
      font-size: 0.9rem;
      height: 24px;
      outline: 0;
    }
  }
  .edit-icon {
    height: min-content;
    font-size: 3.6rem;
    background-color: ${props => (props.editMode ? '#00d600' : '#ababab')};
    border-radius: 25px;
    padding: 5px;
    margin-left: 10px;
    transition: all 0.1s ease-out;
    color: white;
    &:hover {
      transition: all 0.1s ease-out;
      background-color: ${props => (props.editMode ? '#69ff69' : '#8b8b8b')};
    }
  }
  .icon {
    cursor: pointer;
  }
`

export default TagList
