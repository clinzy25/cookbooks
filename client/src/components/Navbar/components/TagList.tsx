import useAppContext from '@/context/app.context'
import { IAppContext } from '@/types/@types.context'
import Link from 'next/link'
import React, { FC, FocusEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { FaUndoAlt } from 'react-icons/fa'
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs'
import styled from 'styled-components'
import { api } from '@/api'
import axios from 'axios'
import { useRouter } from 'next/router'
import Loader from '../../Loader'
import { IEditTag, ITag } from '@/types/@types.tags'
import { IconMixin, TagMixin } from '@/styles/mixins'
import Error from '../../Error'
import { useWindowSize } from '@/utils/utils.hooks'
import { Globals } from '@/styles/theme'

const TagList: FC = () => {
  const {
    query: { cookbook, cookbook_name },
  } = useRouter()
  const {
    tags,
    tagsError,
    tagsOffset,
    tagsLimit,
    isEndOfTags,
    tagsEditMode,
    setTagsEditMode,
    setTagsOffset,
    setSnackbar,
    handleServerError,
    revalidateTags,
  } = useAppContext() as IAppContext
  const [tagsToDelete, setTagsToDelete] = useState<ITag[]>([])
  const [tagsToEdit, setTagsToEdit] = useState<IEditTag[]>([])
  const [submitTrigger, setSubmitTrigger] = useState(false)
  const [showPaginBtns, setShowPaginBtns] = useState(false)
  const [scrollValues, setScrollValues] = useState<number[]>([])
  const [shadowLeft, setShadowLeft] = useState(false)
  const [shadowRight, setShadowRight] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const { width } = useWindowSize()

  const nextTags = (ctr: HTMLDivElement) => {
    for (const tag of Object.values(ctr.children) as HTMLElement[]) {
      const isOverflow = ctr.scrollLeft + ctr.clientWidth < tag.offsetLeft + tag.clientWidth
      if (isOverflow) {
        const scrollTo = tag.offsetLeft - ctr.scrollLeft
        setScrollValues([...scrollValues, scrollTo])
        const fetchMoreTags = ctr.scrollWidth - ctr.scrollLeft - ctr.clientWidth
        if (fetchMoreTags && !isEndOfTags) {
          setTagsOffset(tagsOffset + tagsLimit)
        }
        return ctr.scrollBy({
          left: scrollTo,
          behavior: 'smooth',
        })
      }
    }
  }

  const prevTags = (ctr: HTMLDivElement) => {
    const prevScrollVal = scrollValues[scrollValues.length - 1]
    ctr.scrollBy({
      left: -prevScrollVal,
      behavior: 'smooth',
    })
    const newScrollValues = scrollValues.splice(0, prevScrollVal)
    setScrollValues(newScrollValues)
  }

  const handlePaginate = (direction: 1 | 0) => {
    if (scrollRef.current) {
      return direction ? nextTags(scrollRef.current) : prevTags(scrollRef.current)
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
    if (tagsToEdit.length) {
      const optimisticData = tags.map(t => {
        const editedTag = tagsToEdit.find(tt => tt.tag_name === t.tag_name)
        return editedTag ? { ...t, tag_name: editedTag.new_tag_name } : t
      })
      const body = {
        tags: tagsToEdit,
        cookbook_guid: cookbook,
      }
      // don't await, update with optimisticData
      axios.patch(`${api}/tags`, body)
      return optimisticData
    } else {
      return tags
    }
  }

  const handleSubmitDeletes = async (editOptimistic: ITag[]) => {
    if (tagsToDelete.length) {
      const optimisticData = editOptimistic.filter(t => !tagsToDelete.includes(t))
      const body = {
        tags: tagsToDelete,
        cookbook_guid: cookbook,
      }
      // don't await, update with optimisticData
      axios.delete(`${api}/tags`, { data: body })
      return optimisticData
    } else {
      return editOptimistic
    }
  }

  const handleSubmit = async () => {
    try {
      const optimisticData = await handleSubmitEdits().then(res => handleSubmitDeletes(res))
      revalidateTags(optimisticData, false)
      if (tagsToDelete.length || tagsToEdit.length) {
        setSnackbar({ msg: 'Tags updated', state: 'success' })
      }
      setTagsEditMode(false)
      setSubmitTrigger(false)
      setTagsToDelete([])
      setTagsToEdit([])
    } catch (e) {
      handleServerError(e)
    }
  }

  const handleTagHref = (tag: ITag) => {
    const value = encodeURIComponent(tag.tag_name)
    const c_name = encodeURIComponent(cookbook_name?.toString() as string)
    if (cookbook) {
      return `/cookbooks/${cookbook}/search?cookbook_name=${c_name}&value=${value}`
    }
    return `/search?value=${value}`
  }

  const handleArrows = () => {
    if (scrollRef.current && width) {
      const isOverflow = scrollRef.current.scrollWidth > scrollRef.current.clientWidth
      const isMobile = width < Number(Globals.breakpointMobile)
      setShowPaginBtns(isOverflow && tags.length > 0 && !isMobile)
    }
  }

  const handleShadow = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      const maxScroll = scrollWidth - clientWidth
      if (scrollLeft > 0 && !shadowLeft) {
        setShadowLeft(true)
      } else if (scrollLeft === 0 && shadowLeft) {
        setShadowLeft(false)
      }
      if (scrollLeft > maxScroll - 1 && shadowRight) {
        setShadowRight(false)
      } else if (scrollLeft < maxScroll - 1 && !shadowRight) {
        setShadowRight(true)
      }
    }
  }

  useEffect(() => {
    submitTrigger && handleSubmit()
  }, [submitTrigger])

  useEffect(() => {
    !tagsEditMode && setSubmitTrigger(true)
  }, [tagsEditMode])

  useEffect(() => {
    handleArrows()
    handleShadow()
  }, [scrollRef.current, tags])

  if (!tags) {
    return <Loader size={20} />
  }
  if (tagsError) {
    return <Error fontSize={1} />
  }
  return (
    <Style tagsEditMode={tagsEditMode} right={shadowRight} left={shadowLeft}>
      <div className='icon-ctr'>
        {showPaginBtns && (
          <BsChevronLeft className='pagin-icon left' onClick={() => handlePaginate(0)} />
        )}
      </div>
      <div id='tags-ctr' ref={scrollRef} onScroll={handleShadow}>
        {tags?.map((t: ITag) =>
          tagsEditMode ? (
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
                contentEditable={!tagsToDelete.includes(t)}
                className='editable-tag'>
                {t.tag_name}
              </span>
            </div>
          ) : (
            <Link href={handleTagHref(t)} className='tag' key={t.guid}>
              <span className='hash'>#</span>
              {t.tag_name}
            </Link>
          )
        )}
      </div>
      <div className='icon-ctr'>
        {showPaginBtns && (
          <BsChevronRight className='pagin-icon right' onClick={() => handlePaginate(1)} />
        )}
      </div>
    </Style>
  )
}

type StyleProps = {
  tagsEditMode: boolean
  right: boolean
  left: boolean
}

const Style = styled.div<StyleProps>`
  display: flex;
  align-items: center;
  width: min-content;
  overflow-x: hidden;
  margin: 0 auto 0 auto;
  flex-shrink: 100;
  #tags-ctr {
    display: flex;
    align-items: center;
    position: relative;
    overflow-x: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
    white-space: nowrap;
    height: 40px;
    ${props => {
      const { right, left } = props
      if (left && right) {
        return `mask-image: -moz-linear-gradient(to left, rgba(255, 255, 255, 0.233), rgba(0, 0, 0, 1) 10%), -moz-linear-gradient(to right, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 1) 10%); 
                  mask-composite: intersect;
                  -webkit-mask-image: linear-gradient(to left, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 1) 10%), linear-gradient(to right, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 1) 10%);
                  -webkit-mask-composite: source-in;
                  `
      }
      if (right) {
        return `mask-image: -moz-linear-gradient(to left, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 1) 10%); 
                  -webkit-mask-image: linear-gradient(to left, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 1) 10%);`
      }
      if (left) {
        return `mask-image: -moz-linear-gradient(to right, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 1) 10%);
                  -webkit-mask-image: linear-gradient(to right, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 1) 10%);`
      }
    }};
    &::-webkit-scrollbar {
      display: none;
    }
    .tag {
      ${TagMixin}
      background-color: ${props =>
        props.tagsEditMode
          ? props.theme.buttonBackgroundActive
          : props.theme.buttonBackground};
      .hash {
        margin: 0 3px;
      }
    }
    .undo-icon,
    .delete-icon {
      border-radius: 25px;
      cursor: pointer;
      padding: 2px;
      &:hover {
        color: white;
        background-color: #727272;
      }
    }
    .deleted {
      text-decoration: line-through;
      background-color: ${({ theme }) => theme.nullifiedColor};
      color: white;
      &:hover {
        text-decoration: line-through;
        background-color: ${({ theme }) => theme.nullifiedColor};
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
  .pagin-icon {
    ${IconMixin}
  }
  .left {
    margin-right: 12px;
  }
  .right {
    margin-left: 12px;
  }
  .edit-icon {
    ${IconMixin}
    background-color: ${props => (props.tagsEditMode ? '#00d600' : 'whitesmoke')};
    margin-left: 12px;
    &:hover {
      transition: all 0.1s ease-out;
      background-color: ${props => (props.tagsEditMode ? '#69ff69' : '#d2d2d2')};
    }
  }
`

export default TagList
