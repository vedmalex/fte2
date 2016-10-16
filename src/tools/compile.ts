import * as fs from 'fs-extra';
import * as path from 'path';
import { compileFull } from './../engine/node/compile';
let src = 'templates';

// сделать gulp

function load(fileName, folder, compile, optimize) {
  fs.ensureDirSync(folder);
  let fn = path.resolve(fileName);
  if (fs.existsSync(fn)) {
    let content = fs.readFileSync(fn);
    let result = compile(content, optimize);
    fs.writeFileSync(path.join(folder, path.basename(fileName) + '.js'), result);
  }
}

let files = fs.readdirSync(src);
if (files.length > 0) {
  let rec, stat, ext;
  for (let i = 0, len = files.length; i < len; i++) {
    rec = path.join(src, files[i]);
    stat = fs.statSync(rec);
    if (stat.isFile()) {
      ext = path.extname(rec);
      if (ext === '.nhtml' || ext === '.njs') {
        load(rec, src, compileFull, true);
      }
    }
  }
}
