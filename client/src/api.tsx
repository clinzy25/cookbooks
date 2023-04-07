import axios from 'axios'

const { NODE_ENV, REACT_APP_DEV_API } = process.env

export const api = NODE_ENV === 'development' ? REACT_APP_DEV_API : ''

export const fetcher = async (url: string) =>
  await axios.get(url).then(res => res.data)
