export interface ITag {
  tag_name: string
  weight: number
  guid: string
}
export interface IEditTag extends ITag {
  new_tag_name: string
}

export interface IEditTagRes {
  tag_name: string
  old_tag_name: string
}
