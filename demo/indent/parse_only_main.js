var fs = require('node:fs')
var path = require('path')
var { compileFull, parseFile } = require('../../dist/node')

function load(fileName, folder, compile, optimize) {
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

var files = fs.readdirSync('../../templates')
var stat
if (files.length > 0) {
  var rec, stat, ext
  for (var i = 0, len = files.length; i < len; i++) {
    rec = path.join('../../templates', files[i])
    stat = fs.statSync(rec)
    if (stat.isFile()) {
      ext = path.extname(rec)
      if (ext === '.nhtml' || ext === '.njs') {
        load(rec, './main', compileFull, true)
      }
    }
  }
}
