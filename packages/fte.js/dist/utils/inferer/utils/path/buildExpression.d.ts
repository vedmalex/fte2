import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { Expression } from './Expression';
import { Part } from './Part';
export declare function buildExpression(path: NodePath<t.Node>, name?: string): Expression;
export declare function processCall(path: NodePath<t.Node>, pathArray: Part[]): void;
export declare function processOptionalMember(path: NodePath<t.OptionalCallExpression | t.OptionalMemberExpression>, pathArray: Part[]): void;
export declare function processExpression(path: NodePath<t.Node>, pathArray: Part[]): void;
//# sourceMappingURL=buildExpression.d.ts.map