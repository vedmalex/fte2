var Factory = require('../../dist/node').Factory
var fs = require('node:fs')
var raw = new Factory({
  ext: ['nhtml'],
  root: 'views',
  preload: true,
  debug: true,
})

const s = raw.run(
  {
    title: 'Sample Header',
    body: 'sample panel body content',
  },
  'index',
)

fs.writeFileSync('restult.html', s)
