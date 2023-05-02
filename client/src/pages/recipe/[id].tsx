import { api, fetcher } from '@/api'
import { ISuccessRes } from '@/types/@types.global'
import { IRecipeRes } from '@/types/@types.recipes'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import useAppContext from '@/context/app.context'
import { IAppContext } from '@/types/@types.context'
import { serverErrorMessage } from '@/utils/utils.errors.server'
import axios from 'axios'
import Modal from '@/components/Modal'

type Props = {
  recipe: IRecipeRes
}

const RecipePage: React.FC<Props> = props => {
  // prettier-ignore
  const { guid, name, creator_user_email, image, description, cook_time, prep_time, total_time,
    yield: recipeYield, ingredients, instructions, tags, source_url, created_at,
  } = props.recipe
  const { currentCookbook, setSnackbar } = useAppContext() as IAppContext
  const {
    query: { id },
  } = useRouter()
  const router = useRouter()
  const { user } = useUser()
  const [recipe, setRecipe] = useState<IRecipeRes>(props.recipe)
  const [confirm, setConfirm] = useState(false)
  const [allowEdit] = useState(
    creator_user_email === user?.email || currentCookbook?.creator_user_guid === user?.sub
  )

  const { data, error } = useSWR<ISuccessRes, Error>(
    `${api}/recipes?recipe_guid=${id}`,
    fetcher
  )

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${api}/recipes?recipe_guid=${guid}`)
      if (res.status === 200) {
        setSnackbar({ msg: 'Recipe deleted', state: 'success', duration: 3000 })
      }
      router.push(`/cookbooks/${currentCookbook?.guid}`)
    } catch (e) {
      serverErrorMessage(e, setSnackbar)
    }
  }

  useEffect(() => {
    data?.data && setRecipe(data.data)
  }, [data])

  if (!data && !recipe) {
    return <p>loading...</p>
  }
  if (error) {
    return <p>error</p>
  }
  return (
    <Style id='recipe-page-wrapper'>
      {confirm && (
        <Modal type='confirm' closeModal={() => setConfirm(false)}>
          <div id='confirmation-ctr'>
            <h2>Are you sure you want to delete this recipe?</h2>
            <div>
              <button onClick={handleDelete}>Yes</button>
              <button onClick={() => setConfirm(false)}>No</button>
            </div>
          </div>
        </Modal>
      )}
      <header>
        <h1>{name}</h1>
        {allowEdit && (
          <div>
            <AiOutlineEdit id='edit-icon' />
            <AiOutlineDelete onClick={() => setConfirm(true)} id='delete-icon' />
          </div>
        )}
      </header>
      <div id='tags'>
        {tags?.split(',').map(t => (
          <span key={t}>#{t}</span>
        ))}
      </div>
      <p>Uploaded by {creator_user_email}</p>
      <div className='img-ctr'>
        {image && <Image className='img' src={image} alt={name} fill />}
      </div>
      <div>
        <span>Cook time: {cook_time} </span>
        <span>Prep time: {prep_time} </span>
        <span>Total time: {total_time} </span>
        <span>Servings: {recipeYield}</span>
      </div>
      <p>{source_url}</p>
      <p>Created at: {created_at}</p>
      <p>{description}</p>
      <div id='ingredients'>
        <h2>Ingredients</h2>
        {ingredients.map(ingredient => (
          <p key={ingredient}>{ingredient}</p>
        ))}
      </div>
      <div id='instructions'>
        <h2>Instructions</h2>
        {instructions.map((step, i) => (
          <p key={step}>{`${i + 1}. ${step}`}</p>
        ))}
      </div>
    </Style>
  )
}

export async function getServerSideProps(context: {
  params: { id: string }
}): Promise<{ props: Props }> {
  const id = context.params.id
  const res = await fetcher(`${api}/recipes?recipe_guid=${id}`)
  return { props: { recipe: res.data } }
}

const Style = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  header {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    #edit-icon,
    #delete-icon {
      font-size: 1.8rem;
      cursor: pointer;
    }
  }
  #confirmation-ctr {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    button {
      padding: 15px 30px;
      width: min-content;
      white-space: nowrap;
      border: 1px solid gray;
      border-radius: 10px;
    }
  }
  .img-ctr {
    position: relative;
    width: 500px;
    height: 400px;
    overflow: hidden;
    .img {
      object-fit: cover;
    }
  }
`

export default withPageAuthRequired(RecipePage)
