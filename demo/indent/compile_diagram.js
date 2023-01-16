var fs = require('node:fs')
var path = require('path')
var compileFull = require('../../dist/node').compileFull

function load(fileName, folder, compile, optimize) {
  var fn = path.resolve(fileName)
  if (fs.existsSync(fn)) {
    var content = fs.readFileSync(fn)
    var result = compile(content.toString(), optimize)
    fs.writeFileSync(path.join(folder, path.basename(fileName) + '.js'), result)
  }
}

load('./views/diagram.nhtml', './diagram', compileFull, false)
