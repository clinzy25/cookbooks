import { api, fetcher } from '@/api'
import { IRecipeRes } from '@/types/@types.recipes'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import useSWRInfinite from 'swr/infinite'
import RecipeCard from './components/RecipeCard'
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import AddRecipeModal from './components/AddRecipeModal'
import EditCookbookModal from '../components/EditCookbookModal'
import { AiOutlineEdit } from 'react-icons/ai'
import { AddBtnMixin, IconMixin, ModalBtnMixin } from '@/styles/mixins'
import { IoMdAddCircle } from 'react-icons/io'
import Loader from '@/components/Loader'

type Props = {
  recipes: IRecipeRes[]
}

const CookbookDetailPage: React.FC<Props> = props => {
  const {
    query: { cookbook, cookbook_name, owner },
  } = useRouter()
  const [recipes, setRecipes] = useState<IRecipeRes[]>(props.recipes)
  const [limit] = useState(20)
  const [endOfList, setEndOfList] = useState(false)
  const [recipeModal, setRecipeModal] = useState(false)
  const [editModal, setEditModal] = useState(false)

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
    handleRecipes()
  }, [data]) // eslint-disable-line

  if (!data && !recipes) {
    return <p>loading...</p>
  }
  if (error) {
    return <p>error</p>
  }
  return (
    <Style endOfList={endOfList} id='cookbook-detail-page-wrapper'>
      {recipeModal && (
        <AddRecipeModal revalidateRecipes={mutate} setRecipeModal={setRecipeModal} />
      )}
      {editModal && <EditCookbookModal setEditModal={setEditModal} />}
      <header>
        <h1>{decodeURIComponent(cookbook_name?.toString() as string)}</h1>
        <div>
          {Number(owner) === 1 && (
            <AiOutlineEdit className='edit-icon' onClick={() => setEditModal(true)} />
          )}
        </div>
      </header>
      {!recipes.length && !isValidating ? (
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
              'End of recipes'
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
}): Promise<{ props: Props }> {
  const cookbook = context.params.cookbook
  const recipes = await fetcher(
    `${api}/recipes/cookbook?cookbook=${cookbook}&limit=20&offset=0`
  )
  return { props: { recipes } }
}

type StyleProps = {
  endOfList: boolean
}

const Style = styled.main<StyleProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 15px;
    font-family: ${({ theme }) => theme.headerFont};
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
    display: grid;
    width: 100%;
    gap: 10px;
    grid-template-rows: repeat(1fr);
    grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
    margin-bottom: 50px;
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
  @media screen and (max-width: ${({ theme }) => theme.breakpointMobile}px) {
    header {
      font-size: 0.7rem;
    }
  }
`

export default withPageAuthRequired(CookbookDetailPage)
