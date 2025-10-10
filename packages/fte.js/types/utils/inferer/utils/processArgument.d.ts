import type { Scope } from '@babel/traverse';
import * as t from '@babel/types';
import type { Info } from '../types/Info';
export declare function processArgument(index: number, node: t.Identifier | t.TSParameterProperty | t.RestElement | t.Pattern, actualAgruments: Map<string, Info>, func: Info, scope: Scope, anonymous: () => string): void;
//# sourceMappingURL=processArgument.d.ts.map