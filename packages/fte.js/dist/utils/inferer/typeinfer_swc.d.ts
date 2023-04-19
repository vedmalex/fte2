import { Info } from './Info';
import { ArrowFunctionExpression, ClassMethod, FunctionDeclaration, FunctionExpression, MethodProperty, PrivateMethod } from '@swc/core';
export declare function inferTypesFromFunction(funcCode: string): Map<string, Info>;
export type FunctionType = FunctionExpression | ArrowFunctionExpression | ClassMethod | PrivateMethod | FunctionDeclaration | MethodProperty;
//# sourceMappingURL=typeinfer_swc.d.ts.map