import { Info } from '../types/Info';
import * as t from '@babel/types';
import { Scope } from '@babel/traverse';
export declare function processArgument(index: number, node: t.Identifier | t.TSParameterProperty | t.RestElement | t.Pattern, actualAgruments: Map<string, Info>, func: Info, scope: Scope, anonynmous: () => string): void;
//# sourceMappingURL=processArgument.d.ts.map