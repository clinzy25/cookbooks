import { api, fetcher } from '@/api'
import { IRecipeRes } from '@/types/@types.recipes'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'
import RecipeCard from '../components/RecipeCard'
import useAppContext from '@/context/app.context'
import { IAppContext } from '@/types/@types.context'
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import AddRecipeModal from '../components/AddRecipeModal'
import EditCookbookModal from '../components/EditCookbookModal'
import { AiOutlineEdit } from 'react-icons/ai'
import { BREAKPOINT_MOBILE } from '@/utils/utils.constants'
import { AddBtnMixin, IconMixin } from '@/styles/mixins'
import { IoMdAddCircle } from 'react-icons/io'

type Props = {
  recipes: IRecipeRes[]
}

const CookbookDetailPage: React.FC<Props> = props => {
  const {
    query: { cookbook },
  } = useRouter()
  const { currentCookbook, isCookbookCreator } = useAppContext() as IAppContext
  const [recipes, setRecipes] = useState<IRecipeRes[]>(props.recipes)
  const [recipeModal, setRecipeModal] = useState(false)
  const [editModal, setEditModal] = useState(false)

  const {
    data,
    error,
    mutate: revalidateRecipes,
  } = useSWR<IRecipeRes[], Error>(`${api}/recipes/cookbook?cookbook=${cookbook}`, fetcher)

  useEffect(() => {
    data && setRecipes(data)
  }, [data])

  if (!data && !recipes) {
    return <p>loading...</p>
  }
  if (error) {
    return <p>error</p>
  }
  return (
    <Style BREAKPOINT_MOBILE={BREAKPOINT_MOBILE} id='cookbook-detail-page-wrapper'>
      {recipeModal && (
        <AddRecipeModal
          revalidateRecipes={revalidateRecipes}
          setRecipeModal={setRecipeModal}
        />
      )}
      {editModal && <EditCookbookModal setEditModal={setEditModal} />}
      <header>
        <h1>{currentCookbook?.cookbook_name}</h1>
        <div>
          {isCookbookCreator && (
            <AiOutlineEdit className='edit-icon' onClick={() => setEditModal(true)} />
          )}
        </div>
      </header>
      {!recipes.length ? (
        <div id='cta-ctr'>
          <h1>Somethings missing...</h1>
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
        <div id='recipe-ctr'>
          {recipes.map(recipe => (
            <RecipeCard {...recipe} key={recipe.guid} />
          ))}
        </div>
      )}
      <IoMdAddCircle id='add-recipe-btn' onClick={() => setRecipeModal(true)} />
    </Style>
  )
}

export async function getServerSideProps(context: {
  params: { cookbook: string }
}): Promise<{ props: Props }> {
  const cookbook = context.params.cookbook
  const recipes = await fetcher(`${api}/recipes/cookbook?cookbook=${cookbook}`)
  return { props: { recipes } }
}

type StyleProps = {
  BREAKPOINT_MOBILE: number
}

const Style = styled.main<StyleProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 15px 0;
    div {
      position: relative;
      align-items: center;
      display: flex;
    }
    .edit-icon {
      ${IconMixin}
    }
    ul {
      position: absolute;
      right: -135px;
      top: 40px;
      list-style-type: none;
      border: 1px solid gray;
      border-radius: 5px;
      padding: 8px;
      z-index: 2;
      background-color: #e8e8e8;
      li {
        padding: 5px;
        cursor: pointer;
      }
    }
  }
  #recipe-ctr {
    display: grid;
    width: 100%;
    gap: 5px;
    grid-template-rows: repeat(1fr);
    grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  }
  #cta-ctr {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 50%;
  }
  #add-recipe-btn {
    ${AddBtnMixin}
  }
  @media screen and (max-width: ${props => props.BREAKPOINT_MOBILE}px) {
    header {
      font-size: 0.7rem;
    }
  }
`

export default withPageAuthRequired(CookbookDetailPage)
