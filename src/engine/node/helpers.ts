import * as fs from 'fs-extra';
import { compileLight as compileTemplate } from './compile';
import * as  esprima from 'esprima';
import * as  esmangle from 'esmangle';
import * as  escodegen from 'escodegen';

export function safeEval(src) {
  let hasError = false;
  let ast;
  try {
    ast = esprima.parse(src, {
      sourceType: 'module',
      ecmaVersion: 6,
      comment: true,
    });
  } catch (err) {
    fs.writeFileSync('failed.js', src);
    console.log('\t \x1b[34m' + err.message + '\x1b[0m');
    console.log("for mode debug information see 'failed.js' ");
    hasError = err;
  } finally {
    if (!hasError) {
      let optimized = esmangle.optimize(ast, [
        [esmangle.pass.Registry.pass['remove-empty-statement']],
      ]);
      let output = escodegen.generate(optimized);
      let result;
      try {
        result = eval(output);
      } catch (err) {
        fs.writeFileSync('failed.js', output);
        console.log('\t \x1b[34m' + err.message + '\x1b[0m');
        console.log("for mode debug information see 'failed.js' ");
        hasError = err;
      }
      return result;
    } else {
      throw hasError;
    }
  }
}

export function makeFunction(fnDef, name) {
  let result;
  try {
    let fname = name.replace(/[\s,\\\/\.\-]/g, '_');
    result = safeEval('result = function ' + fname + ' (' + fnDef.parameters + '){\n' + fnDef.body + '\n}');
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
    result = safeEval('result = ' + compiled);
  } catch (error) {
    result = {
      error: error,
      code: src,
    };
  } finally {
    return result;
  }
}
