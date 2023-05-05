import * as t from '@babel/types';
export type File = {
    type: 'File';
    program: Program;
};
export type Program = {
    type: 'Program';
    body: ExpressionStatement[];
};
export type ArchiteralExpression = File | Program;
export type ExpressionStatement = {
    type: 'ExpressionStatement';
    expression: Expression;
};
export type Expression = OptionalCallExpression | OptionalMemberExpression | MemberExpression | ConditionalExpression | CallExpression | BinaryExpression | LogicalExpression | AssignmentExpression | TaggedTemplateExpression | ObjectExpression | NewExpression | ArrayExpression | UnaryExpression | UpdateExpression | ArrowFunctionExpression | FunctionExpression | SequenceExpression;
export type OptionalCallExpression = {
    type: 'OptionalCallExpression';
    callee: Expression;
    optional: boolean;
    arguments: Expression[];
};
export type OptionalMemberExpression = {
    type: 'OptionalMemberExpression';
    object: Expression;
    optional: boolean;
    property: Expression;
};
export type MemberExpression = {
    type: 'MemberExpression';
    object: Expression;
    property: Expression;
};
export type ConditionalExpression = {
    type: 'ConditionalExpression';
    test: Expression;
    consequent: Expression;
    alternate: Expression;
};
export type CallExpression = {
    type: 'CallExpression';
    callee: Expression;
    arguments: Expression[];
};
export type BinaryExpression = {
    type: 'BinaryExpression';
    left: Expression;
    operator: string;
    right: Expression;
};
export type LogicalExpression = {
    type: 'LogicalExpression';
    left: Expression;
    operator: string;
    right: Expression;
};
export type AssignmentExpression = {
    type: 'AssignmentExpression';
    left: Expression;
    operator: string;
    right: Expression;
};
export type TaggedTemplateExpression = {
    type: 'TaggedTemplateExpression';
    tag: Expression;
    quasi: TemplateLiteral;
};
export type TemplateLiteral = {
    type: 'TemplateLiteral';
    quasis: TemplateElement[];
    expressions: Expression[];
};
export type TemplateElement = {
    type: 'TemplateElement';
    value: {
        cooked: string;
        raw: string;
    };
    tail: boolean;
};
export type ObjectExpression = {
    type: 'ObjectExpression';
    properties: ObjectProperty[];
};
export type ObjectProperty = {
    type: 'ObjectProperty';
    key: Expression;
    value: Expression;
};
export type NewExpression = {
    type: 'NewExpression';
    callee: Expression;
    arguments: Expression[];
};
export type ArrayExpression = {
    type: 'ArrayExpression';
    elements: Expression[];
};
export type UnaryExpression = {
    type: 'UnaryExpression';
    operator: string;
    prefix: boolean;
    argument: Expression;
};
export type UpdateExpression = {
    type: 'UpdateExpression';
    operator: string;
    prefix: boolean;
    argument: Expression;
};
export type ArrowFunctionExpression = {
    type: 'ArrowFunctionExpression';
    params: Expression[];
    body: Expression;
};
export type FunctionExpression = {
    type: 'FunctionExpression';
    id: Identifier;
    params: Expression[];
    body: Expression;
};
export type SequenceExpression = {
    type: 'SequenceExpression';
    expressions: Expression[];
};
export type Listeral = Identifier | NumericLiteral | BooleanLiteral | BigIntLiteral | StringLiteral | NullLiteral | RegExpLiteral | RegexLiteral | TemplateLiteral | ThisExpression;
export type Identifier = {
    type: 'Identifier';
    name: string;
};
export type NumericLiteral = {
    type: 'NumericLiteral';
    value: number;
};
export type BooleanLiteral = {
    type: 'BooleanLiteral';
    value: boolean;
};
export type BigIntLiteral = {
    type: 'BigIntLiteral';
    value: bigint;
};
export type StringLiteral = {
    type: 'StringLiteral';
    value: string;
};
export type NullLiteral = {
    type: 'NullLiteral';
};
export type RegExpLiteral = {
    type: 'RegExpLiteral';
    pattern: string;
    flags: string;
};
export type RegexLiteral = {
    type: 'RegexLiteral';
    pattern: string;
    flags: string;
};
export type ThisExpression = {
    type: 'ThisExpression';
};
export type Statement = BlockStatement | ReturnStatement | IfStatement | SwitchStatement | BreakStatement | ContinueStatement | LabeledStatement | ThrowStatement | ForStatement | ForInStatement | ForOfStatement | WhileStatement | DoWhileStatement | WithStatement | TryStatement;
export type BlockStatement = {
    type: 'BlockStatement';
    body: Statement[];
};
export type ReturnStatement = {
    type: 'ReturnStatement';
    argument: Expression;
};
export type IfStatement = {
    type: 'IfStatement';
    test: Expression;
    consequent: Statement;
    alternate: Statement;
};
export type SwitchStatement = {
    type: 'SwitchStatement';
    discriminant: Expression;
    cases: SwitchCase[];
};
export type SwitchCase = {
    type: 'SwitchCase';
    test: Expression;
    consequent: Statement[];
};
export type BreakStatement = {
    type: 'BreakStatement';
    label: Identifier;
};
export type ContinueStatement = {
    type: 'ContinueStatement';
    label: Identifier;
};
export type LabeledStatement = {
    type: 'LabeledStatement';
    label: Identifier;
    body: Statement;
};
export type ThrowStatement = {
    type: 'ThrowStatement';
    argument: Expression;
};
export type ForStatement = {
    type: 'ForStatement';
    init: Expression;
    test: Expression;
    update: Expression;
    body: Statement;
};
export type ForInStatement = {
    type: 'ForInStatement';
    left: Expression;
    right: Expression;
    body: Statement;
};
export type ForOfStatement = {
    type: 'ForOfStatement';
    left: Expression;
    right: Expression;
    body: Statement;
};
export type WhileStatement = {
    type: 'WhileStatement';
    test: Expression;
    body: Statement;
};
export type DoWhileStatement = {
    type: 'DoWhileStatement';
    test: Expression;
    body: Statement;
};
export type WithStatement = {
    type: 'WithStatement';
    object: Expression;
    body: Statement;
};
export type TryStatement = {
    type: 'TryStatement';
    block: BlockStatement;
    handler: CatchClause;
    finalizer: BlockStatement;
};
export type CatchClause = {
    type: 'CatchClause';
    param: Expression;
    body: BlockStatement;
};
export type Pattern = ObjectPattern | ArrayPattern | RestElement | AssignmentPattern;
export type ObjectPattern = {
    type: 'ObjectPattern';
    properties: ObjectProperty[];
};
export type ArrayPattern = {
    type: 'ArrayPattern';
    elements: Expression[];
};
export type RestElement = {
    type: 'RestElement';
    argument: Expression;
};
export type AssignmentPattern = {
    type: 'AssignmentPattern';
    left: Expression;
    right: Expression;
};
export type Node = ArchiteralExpression | ExpressionStatement | Expression | Listeral | Statement | Pattern;
export declare function buildExpression(ast: t.Node): string[];
//# sourceMappingURL=buildExpressionNext.d.ts.map