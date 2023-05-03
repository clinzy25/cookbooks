import useAppContext from '@/context/app.context'
import { IAppContext } from '@/types/@types.context'
import Link from 'next/link'
import React, { FC, FocusEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { IoMdClose } from 'react-icons/io'
import { BsCheckLg } from 'react-icons/bs'
import { FaUndoAlt } from 'react-icons/fa'
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs'
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
    tagsOffset,
    tagsLimit,
    isEndOfTags,
    setTagsOffset,
    setSnackbar,
    handleServerError,
    revalidateTags,
    isCookbookCreator,
  } = useAppContext() as IAppContext
  const [editMode, setEditMode] = useState(false)
  const [tagsToDelete, setTagsToDelete] = useState<ITag[]>([])
  const [tagsToEdit, setTagsToEdit] = useState<IEditTag[]>([])
  const [submitTrigger, setSubmitTrigger] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showPaginBtns, setShowPaginBtns] = useState(false)
  const [scrollValues, setScrollValues] = useState<number[]>([])

  const nextTags = (ctr: HTMLDivElement) => {
    for (const tag of Object.values(ctr.children) as HTMLElement[]) {
      const isOverflow = ctr.scrollLeft + ctr.clientWidth < tag.offsetLeft + tag.clientWidth
      if (isOverflow) {
        const scrollTo = tag.offsetLeft - ctr.scrollLeft
        setScrollValues([...scrollValues, scrollTo])
        if (ctr.scrollWidth - ctr.scrollLeft - ctr.clientWidth && !isEndOfTags) {
          setTagsOffset(tagsOffset + tagsLimit)
          revalidateTags()
        }
        return ctr.scrollBy({
          left: scrollTo,
          behavior: 'smooth',
        })
      }
    }
  }

  const prevTags = (ctr: HTMLDivElement) => {
    const prevScrollVal = scrollValues.length - 1
    const scrollTo = scrollValues[prevScrollVal]
    ctr.scrollBy({
      left: -scrollTo,
      behavior: 'smooth',
    })
    const newScrollValues = scrollValues.splice(0, prevScrollVal)
    setScrollValues(newScrollValues)
  }

  const paginate = (direction: 1 | 0) => {
    if (scrollRef.current) {
      if (direction) {
        nextTags(scrollRef.current)
      } else {
        prevTags(scrollRef.current)
      }
    }
  }

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

  useEffect(() => {
    if (scrollRef.current && tags.length) {
      setShowPaginBtns(scrollRef.current.scrollWidth > scrollRef.current.clientWidth)
    }
  }, [scrollRef.current, tags]) // eslint-disable-line

  if (!tags) {
    return <Loader size={20} />
  }
  if (tagsError) {
    return <p>Error loading tags</p>
  }
  return (
    <Style editMode={editMode}>
      <div className='icon-ctr'>
        {showPaginBtns && (
          <BsChevronLeft className='icon pagin-icon' onClick={() => paginate(0)} />
        )}
      </div>
      <div className='scroll-ctr' ref={scrollRef}>
        {tags?.map((t: ITag) =>
          editMode ? (
            <div key={t.guid} className={`tag ${tagsToDelete.includes(t) && 'deleted'}`}>
              {tagsToDelete.includes(t) ? (
                <FaUndoAlt
                  title='Undo Delete'
                  onClick={() => handleUndo(t)}
                  className='undo-icon'
                />
              ) : (
                <IoMdClose
                  title='Delete Tag'
                  onClick={() => handleQueDeletes(t)}
                  className='delete-icon'
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
      <div className='icon-ctr'>
        {showPaginBtns && (
          <BsChevronRight className='icon pagin-icon' onClick={() => paginate(1)} />
        )}
      </div>
      <div className='icon-ctr'>
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
      </div>
    </Style>
  )
}

type StyleProps = {
  editMode: boolean
}

const Style = styled.div<StyleProps>`
  display: flex;
  align-items: center;
  width: min-content;
  overflow-x: hidden;
  margin: 0 auto 0 auto;
  flex-shrink: 100;
  .scroll-ctr {
    display: flex;
    align-items: center;
    position: relative;
    overflow-x: hidden;
    white-space: nowrap;
    height: 40px;
    margin: 0 12px;
    .tag {
      display: flex;
      align-items: center;
      border: 1px solid ${({ theme }) => theme.softBorder};
      border-radius: 25px;
      background-color: ${({ theme }) => theme.tagColor};
      margin: 0 5px;
      padding: 0 7px;
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
      padding: 2px;
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
  .icon-ctr {
    display: flex;
    align-items: center;
  }
  .icon {
    font-size: 2.2rem;
    background-color: whitesmoke;
    border: 1px solid ${({ theme }) => theme.softBorder};
    border-radius: 25px;
    padding: 5px;
    transition: all 0.1s ease-out;
    cursor: pointer;
  }
  .edit-icon {
    font-size: 2.2rem;
    background-color: ${props => (props.editMode ? '#00d600' : 'whitesmoke')};
    color: black;
    margin-left: 12px;
    &:hover {
      transition: all 0.1s ease-out;
      background-color: ${props => (props.editMode ? '#69ff69' : '#d2d2d2')};
    }
  }
`

export default TagList
