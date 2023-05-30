// @ts-nocheck
import NextCors from 'nextjs-cors'
import { createProxyMiddleware } from 'http-proxy-middleware'

const url =
  process.env.NEXT_PUBLIC_APP_ENV === 'development' ||
  process.env.NEXT_PUBLIC_APP_ENV === 'staging'
    ? process.env.NEXT_PUBLIC_DEV_API
    : process.env.NEXT_PUBLIC_PROD_API

const proxy = createProxyMiddleware({
  target: url,
  secure: false,
  pathRewrite: { '^/api/proxy': '' },
})

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
}

export default function handler(req, res) {
  proxy(req, res, e => {
    if (e) console.error(e)
    throw new Error(`Request '${req.url}' is not proxied`)
  })
}
