export interface ICookbookRes {
  // client does not have guid when creating a cookbook on welcome screen
  guid?: string
  creator_user_guid: string
  cookbook_name: string
  created_at: string
  updated_at: string
}

export interface ICookbookBeforeCreate {
  creator_user_guid: string
  cookbook_name: string
}
