var fs = require('node:fs')
var path = require('path')
var compileFull = require('../../dist/node').compileFull
var compileLight = require('../../dist/node').compileLight

function load(fileName, folder, compile, optimize) {
  var fn = path.resolve(fileName)
  if (fs.existsSync(fn)) {
    var content = fs.readFileSync(fn)
    var result = compile(content.toString(), optimize)
    fs.writeFileSync(path.join(folder, path.basename(fileName) + '.js'), result)
  }
}

var files = fs.readdirSync('./views')
var stat
if (files.length > 0) {
  var rec, stat, ext
  for (var i = 0, len = files.length; i < len; i++) {
    rec = path.join('views', files[i])
    stat = fs.statSync(rec)
    if (stat.isFile()) {
      ext = path.extname(rec)
      if (ext === '.nhtml' || ext === '.njs') {
        load(rec, './raw', compileFull, true)
      }
    }
  }
}
