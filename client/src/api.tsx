import axios from 'axios'

export const api =
  process.env.NEXT_PUBLIC_APP_ENV === 'development' ||
  process.env.NEXT_PUBLIC_APP_ENV === 'staging'
    ? process.env.NEXT_PUBLIC_DEV_PROXY
    : process.env.NEXT_PUBLIC_PROD_PROXY

    export const fetcher = async (url: string) => await axios.get(url).then(res => res.data)
