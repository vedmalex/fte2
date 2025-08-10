"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const glob_1 = require("glob");
const fs_1 = tslib_1.__importDefault(require("fs"));
const filewriter_1 = require("../filewriter");
const compileTs_1 = require("../compileTs");
const compileFull_1 = require("../compileFull");
const parseFile_1 = require("../parseFile");
const run_1 = require("../run");
const contextTypes_1 = require("./contextTypes");
function parseTemplate(fileName, src, dest, compile, { typescript, format, pretty, minify, sourcemap, inlineMap }) {
    const fn = path_1.default.resolve(fileName);
    if (fs_1.default.existsSync(fn)) {
        const content = fs_1.default.readFileSync(fn);
        const relativeName = path_1.default.relative(src, fileName) + (typescript ? '.ts' : '.js');
        const result = compile(content, false, relativeName, src, inlineMap, sourcemap);
        const outPath = path_1.default.join(dest, relativeName);
        if (typeof result === 'string') {
            (0, filewriter_1.writeFile)(outPath, result, minify);
        }
        else if (Array.isArray(result)) {
            result.forEach(file => {
                (0, filewriter_1.writeFile)(path_1.default.join(dest, path_1.default.basename(file.name) + (typescript ? '.ts' : '.js')), file.content, minify);
            });
        }
        else if (result && typeof result === 'object' && 'code' in result) {
            (0, filewriter_1.writeFile)(outPath, result.code, minify);
            if (sourcemap && inlineMap === false && result.map) {
                const mapPath = outPath + '.map';
                (0, filewriter_1.writeRaw)(mapPath, JSON.stringify(result.map));
            }
        }
    }
}
function build(src, dest, options, callback) {
    var _a, _b, _c;
    try {
        const files = (0, glob_1.globSync)(`${src}/**/*${options.ext ? options.ext : '.njs'}`);
        const moduleFormat = options.format === 'esm' ? 'esm' : 'cjs';
        if (options.single) {
            const filelist = files.map(file => {
                const name = path_1.default.relative(src, file);
                const content = fs_1.default.readFileSync(file);
                const template = (0, parseFile_1.parseFile)(content);
                try {
                    const ctxTypes = (0, contextTypes_1.generateContextTypes)(template);
                    template.directives = template.directives || {};
                    template.directives.contextTypes = ctxTypes;
                }
                catch (_a) { }
                return { name, template };
            });
            const templateFile = (0, run_1.run)(filelist, options.typescript
                ? 'singlefile.ts.njs'
                : moduleFormat === 'esm'
                    ? 'singlefile.es6.njs'
                    : 'singlefile.njs');
            if (typeof templateFile == 'string') {
                const desiredExt = options.typescript ? '.ts' : '.js';
                const outName = options.file && options.file.endsWith(desiredExt) ? options.file : `${options.file}${desiredExt}`;
                let header = '';
                if (!options.typescript && moduleFormat === 'cjs') {
                    const withTypes = filelist.find(f => { var _a, _b; return (_b = (_a = f.template) === null || _a === void 0 ? void 0 : _a.directives) === null || _b === void 0 ? void 0 : _b.contextTypes; });
                    const typedef = (_c = (_b = (_a = withTypes === null || withTypes === void 0 ? void 0 : withTypes.template) === null || _a === void 0 ? void 0 : _a.directives) === null || _b === void 0 ? void 0 : _b.contextTypes) === null || _c === void 0 ? void 0 : _c.jsTypedef;
                    if (typedef && typeof typedef === 'string' && typedef.trim().length > 0) {
                        header = typedef + '\n';
                    }
                    else {
                        header = '/**\n * @typedef {object} Template_Context\n */\n';
                    }
                }
                (0, filewriter_1.writeFile)(`${dest}/${outName}`, header + templateFile, options.minify);
            }
            else {
                templateFile.forEach(file => {
                    (0, filewriter_1.writeFile)(`${dest}/${file.name}`, file.content, options.minify);
                });
            }
        }
        else {
            files.forEach(file => {
                parseTemplate(file, src, dest, (content, optimize, fileName, sourceRoot) => (options.typescript ? compileTs_1.compileTs : compileFull_1.compileFull)(content, optimize, fileName, sourceRoot, options.inlineMap, options.sourcemap), options);
            });
            const indexFile = (0, run_1.run)(files.map(f => {
                return {
                    name: path_1.default.relative(src, f),
                    path: `./${path_1.default.relative(src, f)}${options.typescript ? '' : '.js'}`,
                };
            }), options.typescript
                ? options.standalone
                    ? 'standalone.ts.njs'
                    : 'standalone.index.ts.njs'
                : options.standalone
                    ? moduleFormat === 'esm'
                        ? 'standalone.es6.njs'
                        : 'standalone.njs'
                    : moduleFormat === 'esm'
                        ? 'standalone.index.es6.njs'
                        : 'standalone.index.njs');
            if (typeof indexFile == 'string') {
                const desiredExt = options.typescript ? '.ts' : '.js';
                const outName = options.file && options.file.endsWith(desiredExt) ? options.file : `${options.file}${desiredExt}`;
                (0, filewriter_1.writeFile)(`${dest}/${outName}`, indexFile, options.minify);
            }
            else {
                indexFile.forEach(file => {
                    (0, filewriter_1.writeFile)(`${dest}/${file.name}`, file.content, options.minify);
                });
            }
        }
        (0, filewriter_1.commit)()
            .then(_ => callback())
            .catch(err => callback(err));
    }
    catch (err) {
        callback(err);
    }
}
exports.build = build;
//# sourceMappingURL=build.js.map