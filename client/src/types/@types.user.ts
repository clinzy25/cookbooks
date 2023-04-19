export interface IUser {
  id: number
  guid: string
  username: string
  email: string
  is_readonly: number
  created_at: string
  updated_at: string
}

export interface IMemberResult {
  membership_guid: string
  invitation_accepted: number
  user_guid: string
  username: string
  email: string
  is_readonly: number
  created_at: string
}
