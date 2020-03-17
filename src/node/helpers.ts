import * as fs from 'fs-extra';
import { compileLight as compileTemplate } from './compile';

import * as ts from 'typescript';
export function safeEval(src: string) {
  const result = ts.transpileModule(src, {
    compilerOptions: {
      allowJs: true,
      strict: false,
      module: ts.ModuleKind.CommonJS,
    },
  });
  let retval;
  try {
    retval = eval(result.outputText);
  } catch (err) {
    fs.writeFileSync('failed.js', result.outputText);
    console.log(result.diagnostics);
    console.log('\t \x1b[34m' + err.message + '\x1b[0m');
    console.log("for mode debug information see 'failed.js' ");
  }
  return retval;
}

export function makeFunction(fnDef, name) {
  let result;
  try {
    let fname = name.replace(/[\s,\\\/\.\-]/g, '_');
    result = safeEval(
      'function ' +
        fname +
        ' (' +
        fnDef.parameters +
        '){\n' +
        fnDef.body +
        '\n}',
    );
  } catch (error) {
    result = {
      err: error,
      code: fnDef.body,
    };
  } finally {
    return result;
  }
}

export function makeTemplate(src: string) {
  let result;
  let compiled = compileTemplate(src);
  try {
    result = safeEval(compiled);
  } catch (error) {
    result = {
      error: error,
      code: src,
    };
  } finally {
    return result;
  }
}
