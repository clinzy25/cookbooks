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
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import AddBtn from '@/components/buttons/AddBtn'
import AddRecipeModal from './components/AddRecipeModal'

type Props = {
  recipes: IRecipe[]
}

const CookbookDetailPage: React.FC<Props> = (props: Props) => {
  const {
    query: { id },
  } = useRouter()
  const { cookbooks } = useAppContext() as AppContextType
  const [recipes, setRecipes] = useState<IRecipe[]>(props.recipes)
  const [cookbook, setCookbook] = useState<ICookbook | undefined>()
  const [modalOpen, setModalOpen] = useState(false)
  const {
    data,
    error,
    mutate: revalidateRecipes,
  } = useSWR<IRecipe[], Error>(`${api}/recipes/cookbook?cookbook=${id}`, fetcher)

  useEffect(() => {
    data && setRecipes(data)
  }, [data])

  useEffect(() => {
    setCookbook(cookbooks.find((cb: ICookbook) => cb.guid === id))
  }, [cookbooks, setCookbook, id])

  if (!data && !recipes) {
    return <p>loading...</p>
  }
  if (error) {
    return <p>error</p>
  }
  return (
    <Styled>
      {modalOpen && (
        <AddRecipeModal
          revalidateRecipes={revalidateRecipes}
          cookbook={cookbook}
          setModalOpen={setModalOpen}
        />
      )}
      <h1>{cookbook?.cookbook_name}</h1>
      <div id='recipe-ctr'>
        {recipes.map((recipe: IRecipe) => (
          <RecipeCard {...recipe} key={recipe.guid} />
        ))}
      </div>
      <AddBtn handler={() => setModalOpen(true)} />
    </Styled>
  )
}

export async function getServerSideProps(context: {
  params: { id: string }
}): Promise<{ props: Props }> {
  const id = context.params.id
  const recipes: IRecipe[] = await fetcher(`${api}/recipes/cookbook?cookbook=${id}`)
  return { props: { recipes } }
}

const Styled = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  #recipe-ctr {
    display: grid;
    width: 100%;
    gap: 20px;
    grid-template-rows: repeat(1fr);
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
`

export default withPageAuthRequired(CookbookDetailPage)
