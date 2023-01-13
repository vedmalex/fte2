var Factory = require('../../dist/node').Factory
var fs = require('node:fs')
var s
var raw = new Factory({
  ext: ['njs'],
  preload: true,
  root: 'raw',
  debug: true,
})

debugger
s = raw.run({}, 'index.njs')
s.forEach((f) => {
  debugger
  fs.writeFileSync(f.name, f.content)
})
