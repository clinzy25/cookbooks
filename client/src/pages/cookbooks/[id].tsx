import { api, fetcher } from '@/api'
import { IRecipe } from '@/types/@types.recipes'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'
import RecipeCard from './components/RecipeCard'
import { ICookbook } from '@/types/@types.cookbooks'
import useAppContext from '@/context/app.context'
import { AppContextType } from '@/types/@types.context'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import AddBtn from '@/components/buttons/AddBtn'
import AddRecipeModal from './components/AddRecipeModal'
import { CiMenuKebab } from 'react-icons/ci'
import { handleInviteLink } from '@/utils/utils.invite'
import PeopleModal from './components/PeopleModal'

type Props = {
  recipes: IRecipe[]
}

const CookbookDetailPage: React.FC<Props> = (props: Props) => {
  const {
    query: { id },
  } = useRouter()
  const { user } = useUser()
  const { cookbooks, currentCookbook, setCurrentCookbook, setSnackbar } =
    useAppContext() as AppContextType
  const [recipes, setRecipes] = useState<IRecipe[]>(props.recipes)
  const [menuOpen, setMenuOpen] = useState(false)
  const [recipeModal, setRecipeModal] = useState(false)
  const [peopleModal, setPeopleModal] = useState(false)
  const {
    data,
    error,
    mutate: revalidateRecipes,
  } = useSWR<IRecipe[], Error>(`${api}/recipes/cookbook?cookbook=${id}`, fetcher)

  const handleInvite = () => {
    if (currentCookbook?.guid && user?.sub) {
      const body = {
        cookbook_guid: currentCookbook?.guid,
        user_guid: user?.sub,
        invite_guid: '',
      }
      handleInviteLink(body, setSnackbar)
    }
  }

  useEffect(() => {
    data && setRecipes(data)
  }, [data])

  useEffect(() => {
    setCurrentCookbook(cookbooks.find((cb: ICookbook) => cb.guid === id) || null)
  }, [currentCookbook, setCurrentCookbook, id, cookbooks])

  if (!data && !recipes) {
    return <p>loading...</p>
  }
  if (error) {
    return <p>error</p>
  }
  return (
    <Style>
      {recipeModal && (
        <AddRecipeModal
          revalidateRecipes={revalidateRecipes}
          setRecipeModal={setRecipeModal}
        />
      )}
      {peopleModal && <PeopleModal setPeopleModal={setPeopleModal} />}
      <header id='cookbook-header'>
        <div>
          <h1>{currentCookbook?.cookbook_name} </h1>
          <CiMenuKebab onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && (
            <ul>
              <li>Edit Cookbook</li>
              <li>Delete Cookbook</li>
            </ul>
          )}
        </div>
        <button className='btn' onClick={() => setPeopleModal(true)}>
          People
        </button>
      </header>
      {!recipes.length ? (
        <div id='cta-ctr'>
          <h1>Somethings missing...</h1>
          <p>Don&apos;t forget to add some recipes and invite your friends and family!</p>
          <div>
            <button className='btn' onClick={() => setRecipeModal(true)}>
              Add Recipes
            </button>
            <button className='btn' onClick={() => setPeopleModal(true)}>
              Invite People
            </button>
          </div>
        </div>
      ) : (
        <div id='recipe-ctr'>
          {recipes.map((recipe: IRecipe) => (
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
  const recipes: IRecipe[] = await fetcher(`${api}/recipes/cookbook?cookbook=${id}`)
  return { props: { recipes } }
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
  .btn {
    padding: 15px 30px;
    margin: 15px;
    width: min-content;
    white-space: nowrap;
    border: 1px solid gray;
    border-radius: 10px;
  }
`

export default withPageAuthRequired(CookbookDetailPage)
