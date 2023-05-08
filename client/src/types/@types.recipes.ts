export interface IRecipeRes {
  guid: string
  creator_user_guid: string
  creator_user_email: string
  cookbook_guid: string
  name: string
  image: string
  base64_image: string
  description: string
  cook_time: string
  cook_original_format: string
  prep_time: string
  prep_original_format: string
  total_time: string
  total_original_format: string
  yield: string
  ingredients: string[]
  instructions: string[]
  recipe_body: string[]
  notes: string[]
  tags: string
  source_url: string[]
  source_type: string
  is_private: number
  created_at: string
  updated_at: string
}

export interface IRecipeReq {
  url: string
  cookbook_guid?: string | string[]
  source_type: RecipeSourceTypes
  is_private: number
}

export type RecipeSourceTypes = 'link' | 'camera' | 'manual' | ''