"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const path_1 = __importDefault(require("path"));
const glob_1 = __importDefault(require("glob"));
const node_1 = require("./node");
const filewriter_1 = require("./filewriter");
const fs_1 = __importDefault(require("fs"));
function parseTemplate(fileName, dest, compile, { ts, format, pretty, minify, }) {
    const fn = path_1.default.resolve(fileName);
    if (fs_1.default.existsSync(fn)) {
        const content = fs_1.default.readFileSync(fn);
        const result = compile(content);
        if (typeof result == 'string') {
            (0, filewriter_1.writeFile)(path_1.default.join(dest, path_1.default.basename(fileName) + (ts ? '.ts' : '.js')), result, {
                format,
                pretty,
                minify,
            });
        }
        else {
            result.forEach((file) => {
                (0, filewriter_1.writeFile)(path_1.default.join(dest, path_1.default.basename(file.name) + (ts ? '.ts' : '.js')), file.content, {
                    format,
                    pretty,
                    minify,
                });
            });
        }
    }
}
function build(src, dest, options, callback) {
    debugger;
    (0, glob_1.default)(`${src}/**/*${options.ext ? options.ext : '.njs'}`, (err, files) => {
        if (!err) {
            if (options.single) {
                const filelist = files.map((file) => {
                    const name = path_1.default.relative(src, file);
                    const content = fs_1.default.readFileSync(file);
                    return { name, template: (0, node_1.parseFile)(content) };
                });
                const templateFile = (0, node_1.run)(filelist, options.ts ? 'singlefile.njs' : 'singlefile.es6.njs');
                if (typeof templateFile == 'string') {
                    (0, filewriter_1.writeFile)(`${dest}/index${options.ts ? '.ts' : '.js'}`, templateFile);
                }
                else {
                    templateFile.forEach((file) => {
                        (0, filewriter_1.writeFile)(`${dest}/${file.name}`, file.content);
                    });
                }
            }
            else {
                files.forEach((file) => {
                    parseTemplate(file, dest, options.ts ? node_1.compileTs : node_1.compileFull, options);
                });
                const indexFile = (0, node_1.run)(files.map((f) => {
                    const fn = path_1.default.parse(f);
                    return {
                        name: path_1.default.relative(src, f),
                        path: `./${fn.base}${options.ts ? '' : '.js'}`,
                    };
                }), options.ts
                    ? options.sa
                        ? 'standalone.es6.njs'
                        : 'standalone.index.es6.njs'
                    : options.sa
                        ? 'standalone.njs'
                        : 'standalone.index.njs');
                if (typeof indexFile == 'string') {
                    (0, filewriter_1.writeFile)(`${dest}/index${options.ts ? '.ts' : '.js'}`, indexFile);
                }
                else {
                    indexFile.forEach((file) => {
                        (0, filewriter_1.writeFile)(`${dest}/${file.name}`, file.content);
                    });
                }
            }
            (0, filewriter_1.commit)()
                .then((_) => callback())
                .catch((err) => callback(err));
        }
        else {
            callback(err);
        }
    });
}
exports.build = build;
//# sourceMappingURL=build.js.map