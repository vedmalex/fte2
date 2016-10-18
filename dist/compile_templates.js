"use strict";
const fs = require('fs-extra');
const path = require('path');
const _1 = require('./');
let src = 'templates';
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
                load(rec, src, _1.compileFull, true);
            }
        }
    }
}
//# sourceMappingURL=compile_templates.js.map