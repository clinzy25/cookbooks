import Modal from '@/components/Modal'
import useAppContext from '@/context/app.context'
import { AppContextType } from '@/types/@types.context'
import React, { FormEvent, useRef, useState } from 'react'
import styled from 'styled-components'
import { GrFormClose } from 'react-icons/gr'
import { FaUndo } from 'react-icons/fa'
import { serverErrorMessage } from '@/utils/utils.errors.server'
import { api } from '@/api'
import axios from 'axios'
import { ITagRes } from '@/types/@types.tags'

type Props = {
  setUpdateCookbookModal: (bool: boolean) => void
}

const UpdateCookbookModal = ({ setUpdateCookbookModal }: Props) => {
  const { tags, currentCookbook, setSnackbar, revalidateTags } =
    useAppContext() as AppContextType
  const [tagsToDelete, setTagsToDelete] = useState<ITagRes[]>([])
  const nameRef = useRef(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const body = {
      cookbook_guid: currentCookbook?.guid,
      cookbook_name: currentCookbook?.cookbook_name,
      tags_to_delete: tagsToDelete,
    }
    try {
      const res = await axios.patch(`${api}/cookbooks`, body)
      revalidateTags()
    } catch (e) {
      serverErrorMessage(e, setSnackbar)
    }
  }

  const handleTag = (tag: ITagRes, isDeleted: boolean) =>
    isDeleted
      ? setTagsToDelete([...tagsToDelete.filter(t => t.tag_name !== tag.tag_name)])
      : setTagsToDelete([...tagsToDelete, tag])

  return (
    <Modal closeModal={() => setUpdateCookbookModal(false)}>
      <Style>
        <h1>Edit Cookbook</h1>
        <form onSubmit={e => handleSubmit(e)}>
          <label>
            Edit Cookbook Name:
            <input ref={nameRef} type='text' defaultValue={currentCookbook?.cookbook_name} />
          </label>
          <div id='tag-list'>
            Edit Tags:
            {tags.map(t => {
              const isDeleted = tagsToDelete.includes(t)
              return (
                <span
                  onClick={() => handleTag(t, isDeleted)}
                  className={isDeleted ? 'tag deleted-tag' : 'tag'}
                  key={t.guid}>
                  {isDeleted ? (
                    <FaUndo className='tag-icon undo' />
                  ) : (
                    <GrFormClose className='tag-icon delete' />
                  )}
                  {t.tag_name}
                </span>
              )
            })}
          </div>
          <button type='submit'>Submit</button>
        </form>
        <label htmlFor='delete'>
          Delete Cookbook:&nbsp;
          <button name='delete'>Delete</button>
        </label>
      </Style>
    </Modal>
  )
}

const Style = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  .deleted-tag {
    text-decoration: line-through;
    background-color: gray;
  }
  #tag-list {
    display: flex;
    flex-wrap: wrap;
    white-space: nowrap;
    .tag-icon {
    }
    .delete {
      font-size: 1.2rem;
    }
    .tag {
      cursor: pointer;
      display: flex;
      align-items: center;
      border: 1px solid gray;
      margin: 0 5px;
      border-radius: 25px;
      padding: 0 7px;
    }
  }
  button {
    padding: 15px 30px;
    width: min-content;
    white-space: nowrap;
    border: 1px solid gray;
    border-radius: 10px;
  }
`

export default UpdateCookbookModal
