import { api, fetcher } from '@/api'
import { IRecipeRes } from '@/types/@types.recipes'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import useSWRInfinite from 'swr/infinite'
import RecipeCard from './components/RecipeCard'
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import AddRecipeModal from './components/AddRecipeModal'
import EditCookbookModal from './components/EditCookbookModal'
import { AiOutlineEdit } from 'react-icons/ai'
import {
  AddBtnMixin,
  IconMixin,
  ModalBtnMixin,
  PageHeaderMixin,
  RecipeCardGridMixin,
} from '@/styles/mixins'
import { IoMdAddCircle } from 'react-icons/io'
import Loader from '@/components/Loader'
import Error from '@/components/Error'
import useAppContext from '@/context/app.context'
import { IAppContext } from '@/types/@types.context'
import Head from 'next/head'

type Props = {
  recipes: IRecipeRes[]
}

const CookbookDetailPage: React.FC<Props> = props => {
  const {
    query: { cookbook, cookbook_name, owner },
  } = useRouter()
  const { setTagsEditMode } = useAppContext() as IAppContext
  const [recipes, setRecipes] = useState<IRecipeRes[]>(props.recipes)
  const [limit] = useState(20)
  const [endOfList, setEndOfList] = useState(false)
  const [recipeModal, setRecipeModal] = useState(false)
  const [editModal, setEditModal] = useState(false)

  const _cookbook_name = useRef<string>()

  const { data, error, mutate, size, setSize, isValidating, isLoading } = useSWRInfinite(
    (index: number) =>
      `${api}/recipes/cookbook?cookbook=${cookbook}&limit=${limit}&offset=${index * limit}`,
    fetcher
  )

  const handleRecipes = () => {
    data && setEndOfList(data[data.length - 1]?.length < limit)
    setRecipes(data ? Array.prototype.concat(...data) : [])
  }

  useEffect(() => {
    data && handleRecipes()
  }, [data]) // eslint-disable-line

  useEffect(() => {
    !editModal && setTagsEditMode(false)
  }, [editModal]) // eslint-disable-line

  useEffect(() => {
    _cookbook_name.current = decodeURIComponent(cookbook_name?.toString() as string)
  }, [cookbook_name])

  if (!data && !recipes) {
    return <Loader size={50} fillSpace />
  }
  if (error) {
    return <Error fillSpace />
  }
  return (
    <Style endOfList={endOfList} className='page-wrapper' id='cookbook-detail-page-wrapper'>
      <Head>
        <title>{_cookbook_name.current}</title>
      </Head>
      {recipeModal && (
        <AddRecipeModal revalidateRecipes={mutate} setRecipeModal={setRecipeModal} />
      )}
      {editModal && <EditCookbookModal editModal={editModal} setEditModal={setEditModal} />}
      <header>
        <h1>{_cookbook_name.current?.toUpperCase()}</h1>
        <div>
          {Number(owner) === 1 && (
            <AiOutlineEdit className='edit-icon' onClick={() => setEditModal(true)} />
          )}
        </div>
      </header>
      {!recipes.length ? (
        <div id='cta-ctr'>
          <h2>Somethings missing...</h2>
          <p>Don&apos;t forget to add some recipes and invite your friends and family!</p>
          <div>
            <button className='btn' onClick={() => setRecipeModal(true)}>
              Add Recipes
            </button>
            <button className='btn' onClick={() => setEditModal(true)}>
              Invite People
            </button>
          </div>
        </div>
      ) : (
        <>
          <div id='recipe-ctr'>
            {recipes.map(recipe => (
              <RecipeCard {...recipe} key={recipe.guid} />
            ))}
          </div>
          <button onClick={() => !endOfList && setSize(size + 1)} id='pagin-btn'>
            {isLoading || isValidating ? (
              <Loader size={20} />
            ) : endOfList ? (
              'End of Recipes'
            ) : (
              'More'
            )}
          </button>
        </>
      )}
      <IoMdAddCircle id='add-recipe-btn' onClick={() => setRecipeModal(true)} />
    </Style>
  )
}

export async function getServerSideProps(context: {
  params: { cookbook: string }
}): Promise<{ props: Props } | { notFound: true }> {
  const cookbook = context.params.cookbook
  const recipes = await fetcher(
    `${api}/recipes/cookbook?cookbook=${cookbook}&limit=20&offset=0`
  )
  if (!recipes) {
    return {
      notFound: true,
    }
  }
  return { props: { recipes } }
}

type StyleProps = {
  endOfList: boolean
}

const Style = styled.main<StyleProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${PageHeaderMixin}
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 15px;
    div {
      position: relative;
      align-items: center;
      display: flex;
    }
    .edit-icon {
      ${IconMixin}
    }
  }
  #recipe-ctr {
    ${RecipeCardGridMixin}
  }
  #pagin-btn {
    padding: 10px 15px;
    border: 0;
    border-radius: 25px;
    margin-top: 50px;
    cursor: ${props => (props.endOfList ? 'auto' : 'pointer')};
    transition: 0.08s;
    margin-top: auto;
    &:hover {
      pointer-events: ${props => (props.endOfList ? 'none' : 'auto')};
    }
  }
  #cta-ctr {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 500px;
    ${ModalBtnMixin}
    p {
      margin: 15px 0;
    }
  }
  #add-recipe-btn {
    ${AddBtnMixin}
  }
`

export default withPageAuthRequired(CookbookDetailPage)
