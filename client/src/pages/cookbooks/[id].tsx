import { api, fetcher } from '@/api'
import { IRecipeRes } from '@/types/@types.recipes'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'
import RecipeCard from './components/RecipeCard'
import { ICookbookRes } from '@/types/@types.cookbooks'
import useAppContext from '@/context/app.context'
import { IAppContext } from '@/types/@types.context'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import AddBtn from '@/components/buttons/AddBtn'
import AddRecipeModal from './components/AddRecipeModal'
import { ISuccessRes } from '@/types/@types.global'
import EditCookbookModal from './components/EditCookbookModal'
import { AiOutlineEdit } from 'react-icons/ai'

type Props = {
  recipes: IRecipeRes[]
}

const CookbookDetailPage: React.FC<Props> = props => {
  const {
    query: { id },
  } = useRouter()
  const { user } = useUser()
  const { cookbooks, currentCookbook, setCurrentCookbook } = useAppContext() as IAppContext
  const [recipes, setRecipes] = useState<IRecipeRes[]>(props.recipes)
  const [recipeModal, setRecipeModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  
  const allowEdit = currentCookbook?.creator_user_guid === user?.sub

  const {
    data,
    error,
    mutate: revalidateRecipes,
  } = useSWR<ISuccessRes, Error>(`${api}/recipes/cookbook?cookbook=${id}`, fetcher)

  useEffect(() => {
    data?.data && setRecipes(data.data)
  }, [data])

  useEffect(() => {
    setCurrentCookbook(cookbooks.find((cb: ICookbookRes) => cb.guid === id) || null)
  }, [cookbooks, setCurrentCookbook, id])

  if (!data && !recipes) {
    return <p>loading...</p>
  }
  if (error) {
    return <p>error</p>
  }
  return (
    <Style id='cookbook-detail-page-wrapper'>
      {recipeModal && (
        <AddRecipeModal
          revalidateRecipes={revalidateRecipes}
          setRecipeModal={setRecipeModal}
        />
      )}
      {editModal && <EditCookbookModal setEditModal={setEditModal} />}
      <header id='cookbook-header'>
        <h1>{currentCookbook?.cookbook_name}</h1>
        {allowEdit && <AiOutlineEdit onClick={() => setEditModal(true)} />}
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
      <AddBtn handler={() => setRecipeModal(true)} />
    </Style>
  )
}

export async function getServerSideProps(context: {
  params: { id: string }
}): Promise<{ props: Props }> {
  const id = context.params.id
  const res = await fetcher(`${api}/recipes/cookbook?cookbook=${id}`)
  return { props: { recipes: res.data } }
}

const Style = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  #cookbook-header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    div {
      position: relative;
      align-items: center;
      display: flex;
    }
    svg {
      font-size: 1.8rem;
      cursor: pointer;
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
    gap: 20px;
    grid-template-rows: repeat(1fr);
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
  #cta-ctr {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 50%;
  }
`

export default withPageAuthRequired(CookbookDetailPage)
