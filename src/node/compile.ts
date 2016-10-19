import * as raw from '../../grammar/raw.pegjs.js';

// import * as fs from 'fs-extra';
import * as path from 'path';
import * as esprima from 'esprima';
import * as esmangle from 'esmangle2';
import * as escodegen from 'escodegen';
import { TemplateFactory } from './factory';

const templateRoot = path.join(__dirname, './../../templates');

function prepareCode(src, optimize) {
  let errorMessage = '';
  let ast;
  try {
    ast = esprima.parse(src, {
      sourceType: 'module',
      comment: true,
    });
  } catch (err) {
    let F = new TemplateFactory({
      root: templateRoot,
    });
    errorMessage = F.run({
      error: err,
      compiledFile: src,
    }, 'compilationError.njs');
  } finally {
    if (!errorMessage) {
      if (optimize) {
        let optimized = esmangle.optimize(ast, [
          [esmangle.pass.Registry.pass['remove-empty-statement']
            , esmangle.pass.Registry.pass['remove-unreachable-branch']],
        ]);
        let output = escodegen.generate(optimized, {
          format: {
            indent: {
              style: '  ',
              base: 0,
            },
            renumber: true,
            hexadecimal: true,
            escapeless: true,
            compact: false,
            semicolons: false,
            parentheses: false,
          },
        }
        );
        return output;
      } else {
        return src;
      }
    } else {
      return errorMessage;
    }
  }
}

export function compileLight(content: Buffer | string, optimize?: boolean) {
  let compiled = raw.parse(content.toString());
  let F = new TemplateFactory({
    root: templateRoot,
  });
  return prepareCode(F.run(compiled, 'raw.njs'), optimize);
}

export function validate(content) {
  let F = new TemplateFactory({
    root: templateRoot,
  });
  let src = F.run(raw.parse(content.toString()), 'compiled.njs');
  let hasError = false;
  let ast;
  try {
    ast = esprima.parse(src, {
      sourceType: 'module',
      comment: true,
    });
  } catch (err) {
    hasError = err;
  } finally {
    if (!hasError) {
      return true;
    } else {
      return hasError;
    }
  }
}

export function compileFull(content: Buffer | string, optimize) {
  let compiled = raw.parse(content.toString());
  let F = new TemplateFactory({
    root: templateRoot,
  });
  return prepareCode(F.run(compiled, 'compiled.njs'), optimize);
}
