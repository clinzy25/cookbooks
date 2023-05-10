import { api, fetcher } from '@/api'
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
import axios from 'axios'
import Modal from '@/components/Modal'
import { IconMixin, modalBtnMixin } from '@/styles/mixins'
import { TagMixin } from '@/styles/mixins'
import moment from 'moment'

type Props = {
  recipe: IRecipeRes
}

const RecipePage: React.FC<Props> = props => {
  // prettier-ignore
  const { guid, name, creator_user_email, image, base64_image, description, cook_time, prep_time, total_time,
    yield: recipeYield, ingredients, instructions, tags, source_url, created_at,
  } = props.recipe
  const { setSnackbar, handleServerError, isCookbookCreator } = useAppContext() as IAppContext
  const {
    query: { recipe: recipeGuid, cookbook },
  } = useRouter()
  const router = useRouter()
  const { user } = useUser()
  const [recipe, setRecipe] = useState<IRecipeRes>(props.recipe)
  const [confirm, setConfirm] = useState(false)
  const [allowEdit] = useState(creator_user_email === user?.email || isCookbookCreator)

  const { data, error } = useSWR<IRecipeRes, Error>(
    `${api}/recipes?recipe_guid=${recipeGuid}`,
    fetcher
  )

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${api}/recipes?recipe_guid=${guid}`)
      if (res.status === 200) {
        setSnackbar({ msg: 'Recipe deleted', state: 'success' })
      }
      router.push(`/cookbooks/${cookbook}`)
    } catch (e) {
      handleServerError(e)
    }
  }

  useEffect(() => {
    data && setRecipe(data)
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
      <>
        <header>
          <h1>{name}</h1>
          {allowEdit && (
            <div>
              <AiOutlineEdit id='edit-icon' />
              <AiOutlineDelete onClick={() => setConfirm(true)} id='delete-icon' />
            </div>
          )}
        </header>
        <div id='tag-ctr'>
          {tags?.split(',').map(t => (
            <span className='tag' key={t}>
              <span className='hash'>#</span>
              {t}
            </span>
          ))}
        </div>
        <div className='img-ctr'>
          <Image
            className='img'
            src={image}
            alt={name}
            fill
            priority
            placeholder='blur'
            blurDataURL={base64_image}
            sizes='(max-width: 800px) 100vw, 303px'
          />
        </div>
        <div id='time-ctr'>
          <p>
            <span>Cook time: </span>
            <span>{cook_time}</span>
          </p>
          <p>
            <span>Prep time: </span>
            <span>{prep_time}</span>
          </p>
          <p>
            <span>Total time: </span>
            <span>{total_time}</span>
          </p>
          <p>
            <span>Servings: </span>
            <span>{recipeYield}</span>
          </p>
        </div>
        <div id='source-ctr'>
          <p>
            <span>Uploaded by: </span>
            <span>{creator_user_email}</span>
            <span> on </span>
            <span>{moment(created_at).format('MMM D, YYYY')}</span>
          </p>
          <a href={source_url} target='_blank'>
            {new URL(source_url).host}
          </a>
        </div>
        <div id='recipe-body-ctr'>
          <p id='description'>{description}</p>
          <div>
            <h2>Ingredients</h2>
            <ul id='ingredients'>
              {ingredients.map(ingredient => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Instructions</h2>
            <ol id='instructions'>
              {instructions.map((step, i) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </>
    </Style>
  )
}

export async function getServerSideProps(context: {
  params: { recipe: string }
}): Promise<{ props: Props }> {
  const guid = context.params.recipe
  const recipe = await fetcher(`${api}/recipes?recipe_guid=${guid}`)
  return { props: { recipe } }
}


const Style = styled.main`
  display: flex;
  flex-direction: column;
  margin: auto;
  gap: 15px;
  max-width: 700px;
  header {
    display: flex;
    justify-content: space-between;
    div {
      #edit-icon,
      #delete-icon {
        font-size: 1.8rem;
        cursor: pointer;
        margin-left: 10px;
        ${IconMixin}
      }
      white-space: nowrap;
    }
  }
  #tag-ctr {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    .tag {
      ${TagMixin}
      margin: 0;
      &:hover {
        text-decoration: none;
      }
      .hash {
        margin: 0 3px;
      }
    }
  }
  .img-ctr {
    position: relative;
    width: 100%;
    min-height: 450px;
    overflow: hidden;
    border-radius: 15px;
    box-shadow: 2px 2px 5px #b7b7b7;
    .img {
      object-fit: cover;
    }
  }
  #time-ctr,
  #source-ctr {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0 15px;
    font-size: 0.95rem;
    white-space: nowrap;
    p {
      span:first-of-type,
      span:nth-of-type(3) {
        color: gray;
      }
    }
  }
  a {
    color: #0000ee;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  #recipe-body-ctr {
    display: flex;
    flex-direction: column;
    gap: 40px;
    margin-top: 30px;
    line-height: 24px;
    letter-spacing: 0.5px;
    #description {
      font-style: italic;
    }
    h2 {
      margin-bottom: 10px;
    }
    ol,
    ul {
      padding-left: 15px;
    }
    max-width: 700px;
  }
  #confirmation-ctr {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    h2 {
      margin-bottom: 10px;
    }
    ${modalBtnMixin}
  }
  @media screen and (max-width: ${({ theme }) => theme.breakpointMobile}px) {
    #meta-ctr {
      header {
        justify-content: space-between;
        h1 {
          font-size: 1.6rem;
        }
      }
    }
    .text-ctr {
      padding: 0;
    }
  }
`

export default withPageAuthRequired(RecipePage)
