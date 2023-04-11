import axios from 'axios'

export const api =
  process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_DEV_API : ''

export const fetcher = async (url: string) =>
  await axios.get(url).then(res => res.data)
