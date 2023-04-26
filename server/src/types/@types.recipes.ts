export interface IRecipe {
  cookbook_guid: string
  name: string
  image: string
  description: string
  cookTime: string
  prepTime: string
  totalTime: string
  recipeYield: string
  recipeIngredients: string[]
  recipeInstructions: string[]
  recipeCategories: string[]
  recipeCuisines: string[]
  keywords: string[]
  source_type: string
  url: string
  is_private: number
}
