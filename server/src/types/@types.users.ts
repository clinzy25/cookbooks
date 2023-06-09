export interface IMemberResult {
  membership_guid: string
  invitation_accepted: number
  created_at: string
  user_guid: string
  username: string
  email: string
  is_readonly: number
}

export interface IMemberResults {
  members: IMemberResult[]
  pending_invites: IMemberResult[]
}

export interface IUserReq {
  guid: string
  email: string
  username: string
  avatar: string
}