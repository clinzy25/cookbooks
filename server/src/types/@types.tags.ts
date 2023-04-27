export interface ITag {
  tag_name: string
  guid: string
}

export interface IEditTagReq {
  tag_name: string
  guid: string
  new_tag_name: string
}
