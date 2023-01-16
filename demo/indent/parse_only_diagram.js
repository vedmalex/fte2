var fs = require('node:fs')
var path = require('path')
var { parseFile } = require('../../dist/node')

function load(fileName, folder) {
  var fn = path.resolve(fileName)
  if (fs.existsSync(fn)) {
    var content = fs.readFileSync(fn)
    var result = JSON.stringify(parseFile(content), undefined, ' ')
    fs.writeFileSync(
      path.join(folder, path.basename(fileName) + '.json'),
      result,
    )
  }
}

load('./views/diagram.nhtml', './diagram')
