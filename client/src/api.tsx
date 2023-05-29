import axios from 'axios'

export const api = 'http://localhost:3000/api'

export const fetcher = async (url: string) => await axios.get(url).then(res => res.data)
