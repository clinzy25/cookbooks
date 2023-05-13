interface IMemberRes {
  guid: string
  email: string
  username: string
  picture?: string
}

export interface ICookbookRes {
  guid: string
  creator_user_guid: string
  creator_user_email: string
  creator_username: string
  cookbook_members: IMemberRes[]
  cookbook_name: string
  recipe_images: [{
    image: string
    base64_image: string
  }]
  recipe_count: number
  created_at: string
  updated_at: string
}

export interface ICookbookReq {
  creator_user_guid: string
  cookbook_name: string
}
