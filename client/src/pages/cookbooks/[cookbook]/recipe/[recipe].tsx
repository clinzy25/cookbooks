import { api, fetcher } from '@/api'
import Recipe from '@/components/Recipe'
import { IRecipeRes } from '@/types/@types.recipes'
import { FC } from 'react'

type Props = {
  recipe: IRecipeRes
}

/**
 * Recipe page used when inside of a cookbook
 */
const CookbookRecipePage: FC<Props> = props => <Recipe recipe={props.recipe} />

export async function getServerSideProps(context: {
  params: { recipe: string }
}): Promise<{ props: Props }> {
  const guid = context.params.recipe
  const recipe = await fetcher(`${api}/recipes?recipe_guid=${guid}`)
  return { props: { recipe } }
}

export default CookbookRecipePage
