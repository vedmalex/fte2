#!/usr/bin/env node
const http = require('http')
const fs = require('fs')
const path = require('path')

const port = process.env.PORT ? Number(process.env.PORT) : 8080
const root = path.resolve(__dirname, '..', 'examples')

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0])
  let filePath = path.join(root, urlPath)
  if (urlPath.endsWith('/')) filePath = path.join(filePath, 'index.html')
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.statusCode = 404
      res.end('Not found')
      return
    }
    const ext = path.extname(filePath)
    res.setHeader('Content-Type', types[ext] || 'application/octet-stream')
    fs.createReadStream(filePath).pipe(res)
  })
})

server.listen(port, () => {
  console.log(`Serving ${root} at http://localhost:${port}/`)
  console.log('Open /browser-esm-advanced/ or /browser-esm/stream.html')
})
