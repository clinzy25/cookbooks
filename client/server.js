const express = require('express')
const next = require('next')
const { createProxyMiddleware } = require('http-proxy-middleware')

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const apiPaths = {
  '/v1': {
    target: 'http://localhost:8080',
    pathRewrite: {
      '^/v1': '/v1',
    },
    changeOrigin: true,
  },
}

app
  .prepare()
  .then(() => {
    const server = express()

    if (process.env.NODE_ENV !== 'development') {
      server.use('/v1', createProxyMiddleware(apiPaths['/v1']))
    }

    server.all('*', (req, res) => handle(req, res))

    server.listen(port, err => {
      if (err) throw err
      console.log(`Server is running on http://localhost:${port}`)
    })
  })
  .catch(err => console.log('Error:', err))
