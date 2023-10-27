import { Info } from './Info';
import * as t from '@babel/types';
import { Scope } from '@babel/traverse';
export declare function processArgument(index: number, node: t.Identifier | t.TSParameterProperty | t.RestElement | t.Pattern, result: Map<string, Info>, func: Info, scope: Scope): void;
//# sourceMappingURL=processPattern.d.ts.map