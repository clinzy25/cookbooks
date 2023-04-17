export interface IRecipe {
  id: number
  guid: string
  cookbook_id: number
  creator_user_id: number
  name: string
  image?: string
  source?: string
  source_type: 'link' | 'form' | 'camera'
  recipe_body: string
  description: string
  instructions: string
  notes: string
  servings: number
  prep_time: string
  cook_time: string
  author_name: string
  is_private: number
  created_at: string
  updated_at: string
  tags: string
}
