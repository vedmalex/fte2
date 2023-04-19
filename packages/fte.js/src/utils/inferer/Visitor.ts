import {
  Accessibility,
  Argument,
  ArrayExpression,
  ArrayPattern,
  ArrowFunctionExpression,
  AssignmentExpression,
  AssignmentPattern,
  AssignmentPatternProperty,
  AssignmentProperty,
  AwaitExpression,
  BigIntLiteral,
  BinaryExpression,
  BindingIdentifier,
  BlockStatement,
  BooleanLiteral,
  BreakStatement,
  CallExpression,
  CatchClause,
  Class,
  ClassDeclaration,
  ClassExpression,
  ClassMember,
  ClassMethod,
  ClassProperty,
  ComputedPropName,
  ConditionalExpression,
  Constructor,
  ContinueStatement,
  DebuggerStatement,
  Declaration,
  Decorator,
  DefaultDecl,
  DoWhileStatement,
  EmptyStatement,
  ExportAllDeclaration,
  ExportDeclaration,
  ExportDefaultDeclaration,
  ExportDefaultExpression,
  ExportDefaultSpecifier,
  ExportNamedDeclaration,
  ExportNamespaceSpecifier,
  ExportSpecifier,
  ExprOrSpread,
  Expression,
  ExpressionStatement,
  Fn,
  ForInStatement,
  ForOfStatement,
  ForStatement,
  FunctionDeclaration,
  FunctionExpression,
  GetterProperty,
  Identifier,
  IfStatement,
  Import,
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  JSXAttrValue,
  JSXAttribute,
  JSXAttributeName,
  JSXAttributeOrSpread,
  JSXClosingElement,
  JSXClosingFragment,
  JSXElement,
  JSXElementChild,
  JSXElementName,
  JSXEmptyExpression,
  JSXExpressionContainer,
  JSXFragment,
  JSXMemberExpression,
  JSXNamespacedName,
  JSXObject,
  JSXOpeningElement,
  JSXOpeningFragment,
  JSXSpreadChild,
  JSXText,
  KeyValuePatternProperty,
  KeyValueProperty,
  LabeledStatement,
  MemberExpression,
  MetaProperty,
  MethodProperty,
  Module,
  ModuleDeclaration,
  ModuleExportName,
  ModuleItem,
  NamedExportSpecifier,
  NamedImportSpecifier,
  NewExpression,
  NullLiteral,
  NumericLiteral,
  ObjectExpression,
  ObjectPattern,
  ObjectPatternProperty,
  OptionalChainingCall,
  OptionalChainingExpression,
  Param,
  ParenthesisExpression,
  Pattern,
  PrivateMethod,
  PrivateName,
  PrivateProperty,
  Program,
  Property,
  PropertyName,
  RegExpLiteral,
  RestElement,
  ReturnStatement,
  Script,
  SequenceExpression,
  SetterProperty,
  SpreadElement,
  Statement,
  StaticBlock,
  StringLiteral,
  Super,
  SuperPropExpression,
  SwitchCase,
  SwitchStatement,
  TaggedTemplateExpression,
  TemplateLiteral,
  ThisExpression,
  ThrowStatement,
  TryStatement,
  TsAsExpression,
  TsCallSignatureDeclaration,
  TsConstAssertion,
  TsConstructSignatureDeclaration,
  TsEntityName,
  TsEnumDeclaration,
  TsEnumMember,
  TsEnumMemberId,
  TsExportAssignment,
  TsExpressionWithTypeArguments,
  TsExternalModuleReference,
  TsFnParameter,
  TsGetterSignature,
  TsImportEqualsDeclaration,
  TsIndexSignature,
  TsInstantiation,
  TsInterfaceBody,
  TsInterfaceDeclaration,
  TsMethodSignature,
  TsModuleBlock,
  TsModuleDeclaration,
  TsModuleName,
  TsModuleReference,
  TsNamespaceBody,
  TsNamespaceDeclaration,
  TsNamespaceExportDeclaration,
  TsNonNullExpression,
  TsParameterProperty,
  TsParameterPropertyParameter,
  TsPropertySignature,
  TsQualifiedName,
  TsSetterSignature,
  TsType,
  TsTypeAliasDeclaration,
  TsTypeAnnotation,
  TsTypeAssertion,
  TsTypeElement,
  TsTypeParameter,
  TsTypeParameterDeclaration,
  TsTypeParameterInstantiation,
  UnaryExpression,
  UpdateExpression,
  VariableDeclaration,
  VariableDeclarator,
  WhileStatement,
  WithStatement,
  YieldExpression,
  Node,
  HasSpan,
  TsKeywordType,
  TsThisType,
  TsFnOrConstructorType,
  TsTypeReference,
  TsTypeQuery,
  TsTypeLiteral,
  TsArrayType,
  TsTupleType,
  TsOptionalType,
  TsRestType,
  TsUnionOrIntersectionType,
  TsConditionalType,
  TsInferType,
  TsImportType,
  TsIndexedAccessType,
  TsLiteralType,
  TsMappedType,
  TsParenthesizedType,
  TsTypeOperator,
  TsTypePredicate,
  TsUnionType,
  TsIntersectionType,
  TsFunctionType,
  TsConstructorType,
  Invalid,
  Literal,
} from '@swc/core'
import Visitor from '@swc/core/Visitor'

export function isNode(node: unknown): node is Node {
  return typeof node === 'object' && node !== null && typeof node === 'object' && 'type' in node
}

export function isHasSpan(node: unknown): node is HasSpan {
  return typeof node === 'object' && node !== null && typeof node === 'object' && 'span' in node
}

export class BaseVistor extends Visitor {
  public handleProgram?: Visitor['visitProgram']
  public handleModule?: Visitor['visitModule']
  public handleScript?: Visitor['visitScript']
  public handleModuleItems?: Visitor['visitModuleItems']
  public handleModuleItem?: Visitor['visitModuleItem']
  public handleModuleDeclaration?: Visitor['visitModuleDeclaration']
  public handleTsNamespaceExportDeclaration?: Visitor['visitTsNamespaceExportDeclaration']
  public handleTsExportAssignment?: Visitor['visitTsExportAssignment']
  public handleTsImportEqualsDeclaration?: Visitor['visitTsImportEqualsDeclaration']
  public handleTsModuleReference?: Visitor['visitTsModuleReference']
  public handleTsExternalModuleReference?: Visitor['visitTsExternalModuleReference']
  public handleExportAllDeclaration?: Visitor['visitExportAllDeclaration']
  public handleExportDefaultExpression?: Visitor['visitExportDefaultExpression']
  public handleExportNamedDeclaration?: Visitor['visitExportNamedDeclaration']
  public handleExportSpecifiers?: Visitor['visitExportSpecifiers']
  public handleExportSpecifier?: Visitor['visitExportSpecifier']
  public handleNamedExportSpecifier?: Visitor['visitNamedExportSpecifier']
  public handleModuleExportName?: Visitor['visitModuleExportName']
  public handleExportNamespaceSpecifier?: Visitor['visitExportNamespaceSpecifier']
  public handleExportDefaultSpecifier?: Visitor['visitExportDefaultSpecifier']
  public handleOptionalStringLiteral?: Visitor['visitOptionalStringLiteral']
  public handleExportDefaultDeclaration?: Visitor['visitExportDefaultDeclaration']
  public handleDefaultDeclaration?: Visitor['visitDefaultDeclaration']
  public handleFunctionExpression?: Visitor['visitFunctionExpression']
  public handleClassExpression?: Visitor['visitClassExpression']
  public handleExportDeclaration?: Visitor['visitExportDeclaration']
  public handleArrayExpression?: Visitor['visitArrayExpression']
  public handleArrayElement?: Visitor['visitArrayElement']
  public handleExprOrSpread?: Visitor['visitExprOrSpread']
  public handleExprOrSpreads?: Visitor['visitExprOrSpreads']
  public handleSpreadElement?: Visitor['visitSpreadElement']
  public handleOptionalExpression?: Visitor['visitOptionalExpression']
  public handleArrowFunctionExpression?: Visitor['visitArrowFunctionExpression']
  public handleArrowBody?: Visitor['visitArrowBody']
  public handleBlockStatement?: Visitor['visitBlockStatement']
  public handleStatements?: Visitor['visitStatements']
  public handleStatement?: Visitor['visitStatement']
  public handleSwitchStatement?: Visitor['visitSwitchStatement']
  public handleSwitchCases?: Visitor['visitSwitchCases']
  public handleSwitchCase?: Visitor['visitSwitchCase']
  public handleIfStatement?: Visitor['visitIfStatement']
  public handleOptionalStatement?: Visitor['visitOptionalStatement']
  public handleBreakStatement?: Visitor['visitBreakStatement']
  public handleWhileStatement?: Visitor['visitWhileStatement']
  public handleTryStatement?: Visitor['visitTryStatement']
  public handleCatchClause?: Visitor['visitCatchClause']
  public handleThrowStatement?: Visitor['visitThrowStatement']
  public handleReturnStatement?: Visitor['visitReturnStatement']
  public handleLabeledStatement?: Visitor['visitLabeledStatement']
  public handleForStatement?: Visitor['visitForStatement']
  public handleForOfStatement?: Visitor['visitForOfStatement']
  public handleForInStatement?: Visitor['visitForInStatement']
  public handleEmptyStatement?: Visitor['visitEmptyStatement']
  public handleDoWhileStatement?: Visitor['visitDoWhileStatement']
  public handleDebuggerStatement?: Visitor['visitDebuggerStatement']
  public handleWithStatement?: Visitor['visitWithStatement']
  public handleDeclaration?: Visitor['visitDeclaration']
  public handleVariableDeclaration?: Visitor['visitVariableDeclaration']
  public handleVariableDeclarators?: Visitor['visitVariableDeclarators']
  public handleVariableDeclarator?: Visitor['visitVariableDeclarator']
  public handleTsTypeAliasDeclaration?: Visitor['visitTsTypeAliasDeclaration']
  public handleTsModuleDeclaration?: Visitor['visitTsModuleDeclaration']
  public handleTsModuleName?: Visitor['visitTsModuleName']
  public handleTsNamespaceBody?: Visitor['visitTsNamespaceBody']
  public handleTsNamespaceDeclaration?: Visitor['visitTsNamespaceDeclaration']
  public handleTsModuleBlock?: Visitor['visitTsModuleBlock']
  public handleTsInterfaceDeclaration?: Visitor['visitTsInterfaceDeclaration']
  public handleTsInterfaceBody?: Visitor['visitTsInterfaceBody']
  public handleTsTypeElements?: Visitor['visitTsTypeElements']
  public handleTsTypeElement?: Visitor['visitTsTypeElement']
  public handleTsCallSignatureDeclaration?: Visitor['visitTsCallSignatureDeclaration']
  public handleTsConstructSignatureDeclaration?: Visitor['visitTsConstructSignatureDeclaration']
  public handleTsPropertySignature?: Visitor['visitTsPropertySignature']
  public handleTsGetterSignature?: Visitor['visitTsGetterSignature']
  public handleTsSetterSignature?: Visitor['visitTsSetterSignature']
  public handleTsMethodSignature?: Visitor['visitTsMethodSignature']
  public handleTsEnumDeclaration?: Visitor['visitTsEnumDeclaration']
  public handleTsEnumMembers?: Visitor['visitTsEnumMembers']
  public handleTsEnumMember?: Visitor['visitTsEnumMember']
  public handleTsEnumMemberId?: Visitor['visitTsEnumMemberId']
  public handleFunctionDeclaration?: Visitor['visitFunctionDeclaration']
  public handleClassDeclaration?: Visitor['visitClassDeclaration']
  public handleClassBody?: Visitor['visitClassBody']
  public handleClassMember?: Visitor['visitClassMember']
  public handleTsIndexSignature?: Visitor['visitTsIndexSignature']
  public handleTsFnParameters?: Visitor['visitTsFnParameters']
  public handleTsFnParameter?: Visitor['visitTsFnParameter']
  public handlePrivateProperty?: Visitor['visitPrivateProperty']
  public handlePrivateMethod?: Visitor['visitPrivateMethod']
  public handlePrivateName?: Visitor['visitPrivateName']
  public handleConstructor?: Visitor['visitConstructor']
  public handleConstructorParameters?: Visitor['visitConstructorParameters']
  public handleConstructorParameter?: Visitor['visitConstructorParameter']
  public handleStaticBlock?: Visitor['visitStaticBlock']
  public handleTsParameterProperty?: Visitor['visitTsParameterProperty']
  public handleTsParameterPropertyParameter?: Visitor['visitTsParameterPropertyParameter']
  public handlePropertyName?: Visitor['visitPropertyName']
  public handleAccessibility?: Visitor['visitAccessibility']
  public handleClassProperty?: Visitor['visitClassProperty']
  public handleClassMethod?: Visitor['visitClassMethod']
  public handleComputedPropertyKey?: Visitor['visitComputedPropertyKey']
  public handleClass?: Visitor['visitClass']
  public handleFunction?: Visitor['visitFunction']
  public handleTsExpressionsWithTypeArguments?: Visitor['visitTsExpressionsWithTypeArguments']
  public handleTsExpressionWithTypeArguments?: Visitor['visitTsExpressionWithTypeArguments']
  public handleTsTypeParameterInstantiation?: Visitor['visitTsTypeParameterInstantiation']
  public handleTsTypes?: Visitor['visitTsTypes']
  public handleTsEntityName?: Visitor['visitTsEntityName']
  public handleTsQualifiedName?: Visitor['visitTsQualifiedName']
  public handleDecorators?: Visitor['visitDecorators']
  public handleDecorator?: Visitor['visitDecorator']
  public handleExpressionStatement?: Visitor['visitExpressionStatement']
  public handleContinueStatement?: Visitor['visitContinueStatement']
  public handleExpression?: Visitor['visitExpression']
  public handleOptionalChainingExpression?: Visitor['visitOptionalChainingExpression']
  public handleMemberExpressionOrOptionalChainingCall?: Visitor['visitMemberExpressionOrOptionalChainingCall']
  public handleOptionalChainingCall?: Visitor['visitOptionalChainingCall']
  public handleAssignmentExpression?: Visitor['visitAssignmentExpression']
  public handlePatternOrExpression?: Visitor['visitPatternOrExpression']
  public handleYieldExpression?: Visitor['visitYieldExpression']
  public handleUpdateExpression?: Visitor['visitUpdateExpression']
  public handleUnaryExpression?: Visitor['visitUnaryExpression']
  public handleTsTypeAssertion?: Visitor['visitTsTypeAssertion']
  public handleTsConstAssertion?: Visitor['visitTsConstAssertion']
  public handleTsInstantiation?: Visitor['visitTsInstantiation']
  public handleTsNonNullExpression?: Visitor['visitTsNonNullExpression']
  public handleTsAsExpression?: Visitor['visitTsAsExpression']
  public handleThisExpression?: Visitor['visitThisExpression']
  public handleTemplateLiteral?: Visitor['visitTemplateLiteral']
  public handleParameters?: Visitor['visitParameters']
  public handleParameter?: Visitor['visitParameter']
  public handleTaggedTemplateExpression?: Visitor['visitTaggedTemplateExpression']
  public handleSequenceExpression?: Visitor['visitSequenceExpression']
  public handleRegExpLiteral?: Visitor['visitRegExpLiteral']
  public handleParenthesisExpression?: Visitor['visitParenthesisExpression']
  public handleObjectExpression?: Visitor['visitObjectExpression']
  public handleObjectProperties?: Visitor['visitObjectProperties']
  public handleObjectProperty?: Visitor['visitObjectProperty']
  public handleProperty?: Visitor['visitProperty']
  public handleSetterProperty?: Visitor['visitSetterProperty']
  public handleMethodProperty?: Visitor['visitMethodProperty']
  public handleKeyValueProperty?: Visitor['visitKeyValueProperty']
  public handleGetterProperty?: Visitor['visitGetterProperty']
  public handleAssignmentProperty?: Visitor['visitAssignmentProperty']
  public handleNullLiteral?: Visitor['visitNullLiteral']
  public handleNewExpression?: Visitor['visitNewExpression']
  public handleTsTypeArguments?: Visitor['visitTsTypeArguments']
  public handleArguments?: Visitor['visitArguments']
  public handleArgument?: Visitor['visitArgument']
  public handleMetaProperty?: Visitor['visitMetaProperty']
  public handleMemberExpression?: Visitor['visitMemberExpression']
  public handleSuperPropExpression?: Visitor['visitSuperPropExpression']
  public handleCallee?: Visitor['visitCallee']
  public handleJSXText?: Visitor['visitJSXText']
  public handleJSXNamespacedName?: Visitor['visitJSXNamespacedName']
  public handleJSXMemberExpression?: Visitor['visitJSXMemberExpression']
  public handleJSXObject?: Visitor['visitJSXObject']
  public handleJSXFragment?: Visitor['visitJSXFragment']
  public handleJSXClosingFragment?: Visitor['visitJSXClosingFragment']
  public handleJSXElementChildren?: Visitor['visitJSXElementChildren']
  public handleJSXElementChild?: Visitor['visitJSXElementChild']
  public handleJSXExpressionContainer?: Visitor['visitJSXExpressionContainer']
  public handleJSXSpreadChild?: Visitor['visitJSXSpreadChild']
  public handleJSXOpeningFragment?: Visitor['visitJSXOpeningFragment']
  public handleJSXEmptyExpression?: Visitor['visitJSXEmptyExpression']
  public handleJSXElement?: Visitor['visitJSXElement']
  public handleJSXClosingElement?: Visitor['visitJSXClosingElement']
  public handleJSXElementName?: Visitor['visitJSXElementName']
  public handleJSXOpeningElement?: Visitor['visitJSXOpeningElement']
  public handleJSXAttributes?: Visitor['visitJSXAttributes']
  public handleJSXAttributeOrSpread?: Visitor['visitJSXAttributeOrSpread']
  public handleJSXAttributeOrSpreads?: Visitor['visitJSXAttributeOrSpreads']
  public handleJSXAttribute?: Visitor['visitJSXAttribute']
  public handleJSXAttributeValue?: Visitor['visitJSXAttributeValue']
  public handleJSXAttributeName?: Visitor['visitJSXAttributeName']
  public handleConditionalExpression?: Visitor['visitConditionalExpression']
  public handleCallExpression?: Visitor['visitCallExpression']
  public handleBooleanLiteral?: Visitor['visitBooleanLiteral']
  public handleBinaryExpression?: Visitor['visitBinaryExpression']
  public handleAwaitExpression?: Visitor['visitAwaitExpression']
  public handleTsTypeParameterDeclaration?: Visitor['visitTsTypeParameterDeclaration']
  public handleTsTypeParameters?: Visitor['visitTsTypeParameters']
  public handleTsTypeParameter?: Visitor['visitTsTypeParameter']
  public handleTsTypeAnnotation?: Visitor['visitTsTypeAnnotation']
  public handleTsType?: Visitor['visitTsType']
  public handlePatterns?: Visitor['visitPatterns']
  public handleImportDeclaration?: Visitor['visitImportDeclaration']
  public handleImportSpecifiers?: Visitor['visitImportSpecifiers']
  public handleImportSpecifier?: Visitor['visitImportSpecifier']
  public handleNamedImportSpecifier?: Visitor['visitNamedImportSpecifier']
  public handleImportNamespaceSpecifier?: Visitor['visitImportNamespaceSpecifier']
  public handleImportDefaultSpecifier?: Visitor['visitImportDefaultSpecifier']
  public handleBindingIdentifier?: Visitor['visitBindingIdentifier']
  public handleIdentifierReference?: Visitor['visitIdentifierReference']
  public handleLabelIdentifier?: Visitor['visitLabelIdentifier']
  public handleIdentifier?: Visitor['visitIdentifier']
  public handleStringLiteral?: Visitor['visitStringLiteral']
  public handleNumericLiteral?: Visitor['visitNumericLiteral']
  public handleBigIntLiteral?: Visitor['visitBigIntLiteral']
  public handlePattern?: Visitor['visitPattern']
  public handleRestElement?: Visitor['visitRestElement']
  public handleAssignmentPattern?: Visitor['visitAssignmentPattern']
  public handleObjectPattern?: Visitor['visitObjectPattern']
  public handleObjectPatternProperties?: Visitor['visitObjectPatternProperties']
  public handleObjectPatternProperty?: Visitor['visitObjectPatternProperty']
  public handleKeyValuePatternProperty?: Visitor['visitKeyValuePatternProperty']
  public handleAssignmentPatternProperty?: Visitor['visitAssignmentPatternProperty']
  public handleArrayPattern?: Visitor['visitArrayPattern']
  public handleArrayPatternElements?: Visitor['visitArrayPatternElements']
  public handleArrayPatternElement?: Visitor['visitArrayPatternElement']
  constructor(context?: {
    visitProgram?: Visitor['visitProgram']
    visitModule?: Visitor['visitModule']
    visitScript?: Visitor['visitScript']
    visitModuleItems?: Visitor['visitModuleItems']
    visitModuleItem?: Visitor['visitModuleItem']
    visitModuleDeclaration?: Visitor['visitModuleDeclaration']
    visitTsNamespaceExportDeclaration?: Visitor['visitTsNamespaceExportDeclaration']
    visitTsExportAssignment?: Visitor['visitTsExportAssignment']
    visitTsImportEqualsDeclaration?: Visitor['visitTsImportEqualsDeclaration']
    visitTsModuleReference?: Visitor['visitTsModuleReference']
    visitTsExternalModuleReference?: Visitor['visitTsExternalModuleReference']
    visitExportAllDeclaration?: Visitor['visitExportAllDeclaration']
    visitExportDefaultExpression?: Visitor['visitExportDefaultExpression']
    visitExportNamedDeclaration?: Visitor['visitExportNamedDeclaration']
    visitExportSpecifiers?: Visitor['visitExportSpecifiers']
    visitExportSpecifier?: Visitor['visitExportSpecifier']
    visitNamedExportSpecifier?: Visitor['visitNamedExportSpecifier']
    visitModuleExportName?: Visitor['visitModuleExportName']
    visitExportNamespaceSpecifier?: Visitor['visitExportNamespaceSpecifier']
    visitExportDefaultSpecifier?: Visitor['visitExportDefaultSpecifier']
    visitOptionalStringLiteral?: Visitor['visitOptionalStringLiteral']
    visitExportDefaultDeclaration?: Visitor['visitExportDefaultDeclaration']
    visitDefaultDeclaration?: Visitor['visitDefaultDeclaration']
    visitFunctionExpression?: Visitor['visitFunctionExpression']
    visitClassExpression?: Visitor['visitClassExpression']
    visitExportDeclaration?: Visitor['visitExportDeclaration']
    visitArrayExpression?: Visitor['visitArrayExpression']
    visitArrayElement?: Visitor['visitArrayElement']
    visitExprOrSpread?: Visitor['visitExprOrSpread']
    visitExprOrSpreads?: Visitor['visitExprOrSpreads']
    visitSpreadElement?: Visitor['visitSpreadElement']
    visitOptionalExpression?: Visitor['visitOptionalExpression']
    visitArrowFunctionExpression?: Visitor['visitArrowFunctionExpression']
    visitArrowBody?: Visitor['visitArrowBody']
    visitBlockStatement?: Visitor['visitBlockStatement']
    visitStatements?: Visitor['visitStatements']
    visitStatement?: Visitor['visitStatement']
    visitSwitchStatement?: Visitor['visitSwitchStatement']
    visitSwitchCases?: Visitor['visitSwitchCases']
    visitSwitchCase?: Visitor['visitSwitchCase']
    visitIfStatement?: Visitor['visitIfStatement']
    visitOptionalStatement?: Visitor['visitOptionalStatement']
    visitBreakStatement?: Visitor['visitBreakStatement']
    visitWhileStatement?: Visitor['visitWhileStatement']
    visitTryStatement?: Visitor['visitTryStatement']
    visitCatchClause?: Visitor['visitCatchClause']
    visitThrowStatement?: Visitor['visitThrowStatement']
    visitReturnStatement?: Visitor['visitReturnStatement']
    visitLabeledStatement?: Visitor['visitLabeledStatement']
    visitForStatement?: Visitor['visitForStatement']
    visitForOfStatement?: Visitor['visitForOfStatement']
    visitForInStatement?: Visitor['visitForInStatement']
    visitEmptyStatement?: Visitor['visitEmptyStatement']
    visitDoWhileStatement?: Visitor['visitDoWhileStatement']
    visitDebuggerStatement?: Visitor['visitDebuggerStatement']
    visitWithStatement?: Visitor['visitWithStatement']
    visitDeclaration?: Visitor['visitDeclaration']
    visitVariableDeclaration?: Visitor['visitVariableDeclaration']
    visitVariableDeclarators?: Visitor['visitVariableDeclarators']
    visitVariableDeclarator?: Visitor['visitVariableDeclarator']
    visitTsTypeAliasDeclaration?: Visitor['visitTsTypeAliasDeclaration']
    visitTsModuleDeclaration?: Visitor['visitTsModuleDeclaration']
    visitTsModuleName?: Visitor['visitTsModuleName']
    visitTsNamespaceBody?: Visitor['visitTsNamespaceBody']
    visitTsNamespaceDeclaration?: Visitor['visitTsNamespaceDeclaration']
    visitTsModuleBlock?: Visitor['visitTsModuleBlock']
    visitTsInterfaceDeclaration?: Visitor['visitTsInterfaceDeclaration']
    visitTsInterfaceBody?: Visitor['visitTsInterfaceBody']
    visitTsTypeElements?: Visitor['visitTsTypeElements']
    visitTsTypeElement?: Visitor['visitTsTypeElement']
    visitTsCallSignatureDeclaration?: Visitor['visitTsCallSignatureDeclaration']
    visitTsConstructSignatureDeclaration?: Visitor['visitTsConstructSignatureDeclaration']
    visitTsPropertySignature?: Visitor['visitTsPropertySignature']
    visitTsGetterSignature?: Visitor['visitTsGetterSignature']
    visitTsSetterSignature?: Visitor['visitTsSetterSignature']
    visitTsMethodSignature?: Visitor['visitTsMethodSignature']
    visitTsEnumDeclaration?: Visitor['visitTsEnumDeclaration']
    visitTsEnumMembers?: Visitor['visitTsEnumMembers']
    visitTsEnumMember?: Visitor['visitTsEnumMember']
    visitTsEnumMemberId?: Visitor['visitTsEnumMemberId']
    visitFunctionDeclaration?: Visitor['visitFunctionDeclaration']
    visitClassDeclaration?: Visitor['visitClassDeclaration']
    visitClassBody?: Visitor['visitClassBody']
    visitClassMember?: Visitor['visitClassMember']
    visitTsIndexSignature?: Visitor['visitTsIndexSignature']
    visitTsFnParameters?: Visitor['visitTsFnParameters']
    visitTsFnParameter?: Visitor['visitTsFnParameter']
    visitPrivateProperty?: Visitor['visitPrivateProperty']
    visitPrivateMethod?: Visitor['visitPrivateMethod']
    visitPrivateName?: Visitor['visitPrivateName']
    visitConstructor?: Visitor['visitConstructor']
    visitConstructorParameters?: Visitor['visitConstructorParameters']
    visitConstructorParameter?: Visitor['visitConstructorParameter']
    visitStaticBlock?: Visitor['visitStaticBlock']
    visitTsParameterProperty?: Visitor['visitTsParameterProperty']
    visitTsParameterPropertyParameter?: Visitor['visitTsParameterPropertyParameter']
    visitPropertyName?: Visitor['visitPropertyName']
    visitAccessibility?: Visitor['visitAccessibility']
    visitClassProperty?: Visitor['visitClassProperty']
    visitClassMethod?: Visitor['visitClassMethod']
    visitComputedPropertyKey?: Visitor['visitComputedPropertyKey']
    visitClass?: Visitor['visitClass']
    visitFunction?: Visitor['visitFunction']
    visitTsExpressionsWithTypeArguments?: Visitor['visitTsExpressionsWithTypeArguments']
    visitTsExpressionWithTypeArguments?: Visitor['visitTsExpressionWithTypeArguments']
    visitTsTypeParameterInstantiation?: Visitor['visitTsTypeParameterInstantiation']
    visitTsTypes?: Visitor['visitTsTypes']
    visitTsEntityName?: Visitor['visitTsEntityName']
    visitTsQualifiedName?: Visitor['visitTsQualifiedName']
    visitDecorators?: Visitor['visitDecorators']
    visitDecorator?: Visitor['visitDecorator']
    visitExpressionStatement?: Visitor['visitExpressionStatement']
    visitContinueStatement?: Visitor['visitContinueStatement']
    visitExpression?: Visitor['visitExpression']
    visitOptionalChainingExpression?: Visitor['visitOptionalChainingExpression']
    visitMemberExpressionOrOptionalChainingCall?: Visitor['visitMemberExpressionOrOptionalChainingCall']
    visitOptionalChainingCall?: Visitor['visitOptionalChainingCall']
    visitAssignmentExpression?: Visitor['visitAssignmentExpression']
    visitPatternOrExpression?: Visitor['visitPatternOrExpression']
    visitYieldExpression?: Visitor['visitYieldExpression']
    visitUpdateExpression?: Visitor['visitUpdateExpression']
    visitUnaryExpression?: Visitor['visitUnaryExpression']
    visitTsTypeAssertion?: Visitor['visitTsTypeAssertion']
    visitTsConstAssertion?: Visitor['visitTsConstAssertion']
    visitTsInstantiation?: Visitor['visitTsInstantiation']
    visitTsNonNullExpression?: Visitor['visitTsNonNullExpression']
    visitTsAsExpression?: Visitor['visitTsAsExpression']
    visitThisExpression?: Visitor['visitThisExpression']
    visitTemplateLiteral?: Visitor['visitTemplateLiteral']
    visitParameters?: Visitor['visitParameters']
    visitParameter?: Visitor['visitParameter']
    visitTaggedTemplateExpression?: Visitor['visitTaggedTemplateExpression']
    visitSequenceExpression?: Visitor['visitSequenceExpression']
    visitRegExpLiteral?: Visitor['visitRegExpLiteral']
    visitParenthesisExpression?: Visitor['visitParenthesisExpression']
    visitObjectExpression?: Visitor['visitObjectExpression']
    visitObjectProperties?: Visitor['visitObjectProperties']
    visitObjectProperty?: Visitor['visitObjectProperty']
    visitProperty?: Visitor['visitProperty']
    visitSetterProperty?: Visitor['visitSetterProperty']
    visitMethodProperty?: Visitor['visitMethodProperty']
    visitKeyValueProperty?: Visitor['visitKeyValueProperty']
    visitGetterProperty?: Visitor['visitGetterProperty']
    visitAssignmentProperty?: Visitor['visitAssignmentProperty']
    visitNullLiteral?: Visitor['visitNullLiteral']
    visitNewExpression?: Visitor['visitNewExpression']
    visitTsTypeArguments?: Visitor['visitTsTypeArguments']
    visitArguments?: Visitor['visitArguments']
    visitArgument?: Visitor['visitArgument']
    visitMetaProperty?: Visitor['visitMetaProperty']
    visitMemberExpression?: Visitor['visitMemberExpression']
    visitSuperPropExpression?: Visitor['visitSuperPropExpression']
    visitCallee?: Visitor['visitCallee']
    visitJSXText?: Visitor['visitJSXText']
    visitJSXNamespacedName?: Visitor['visitJSXNamespacedName']
    visitJSXMemberExpression?: Visitor['visitJSXMemberExpression']
    visitJSXObject?: Visitor['visitJSXObject']
    visitJSXFragment?: Visitor['visitJSXFragment']
    visitJSXClosingFragment?: Visitor['visitJSXClosingFragment']
    visitJSXElementChildren?: Visitor['visitJSXElementChildren']
    visitJSXElementChild?: Visitor['visitJSXElementChild']
    visitJSXExpressionContainer?: Visitor['visitJSXExpressionContainer']
    visitJSXSpreadChild?: Visitor['visitJSXSpreadChild']
    visitJSXOpeningFragment?: Visitor['visitJSXOpeningFragment']
    visitJSXEmptyExpression?: Visitor['visitJSXEmptyExpression']
    visitJSXElement?: Visitor['visitJSXElement']
    visitJSXClosingElement?: Visitor['visitJSXClosingElement']
    visitJSXElementName?: Visitor['visitJSXElementName']
    visitJSXOpeningElement?: Visitor['visitJSXOpeningElement']
    visitJSXAttributes?: Visitor['visitJSXAttributes']
    visitJSXAttributeOrSpread?: Visitor['visitJSXAttributeOrSpread']
    visitJSXAttributeOrSpreads?: Visitor['visitJSXAttributeOrSpreads']
    visitJSXAttribute?: Visitor['visitJSXAttribute']
    visitJSXAttributeValue?: Visitor['visitJSXAttributeValue']
    visitJSXAttributeName?: Visitor['visitJSXAttributeName']
    visitConditionalExpression?: Visitor['visitConditionalExpression']
    visitCallExpression?: Visitor['visitCallExpression']
    visitBooleanLiteral?: Visitor['visitBooleanLiteral']
    visitBinaryExpression?: Visitor['visitBinaryExpression']
    visitAwaitExpression?: Visitor['visitAwaitExpression']
    visitTsTypeParameterDeclaration?: Visitor['visitTsTypeParameterDeclaration']
    visitTsTypeParameters?: Visitor['visitTsTypeParameters']
    visitTsTypeParameter?: Visitor['visitTsTypeParameter']
    visitTsTypeAnnotation?: Visitor['visitTsTypeAnnotation']
    visitTsType?: Visitor['visitTsType']
    visitPatterns?: Visitor['visitPatterns']
    visitImportDeclaration?: Visitor['visitImportDeclaration']
    visitImportSpecifiers?: Visitor['visitImportSpecifiers']
    visitImportSpecifier?: Visitor['visitImportSpecifier']
    visitNamedImportSpecifier?: Visitor['visitNamedImportSpecifier']
    visitImportNamespaceSpecifier?: Visitor['visitImportNamespaceSpecifier']
    visitImportDefaultSpecifier?: Visitor['visitImportDefaultSpecifier']
    visitBindingIdentifier?: Visitor['visitBindingIdentifier']
    visitIdentifierReference?: Visitor['visitIdentifierReference']
    visitLabelIdentifier?: Visitor['visitLabelIdentifier']
    visitIdentifier?: Visitor['visitIdentifier']
    visitStringLiteral?: Visitor['visitStringLiteral']
    visitNumericLiteral?: Visitor['visitNumericLiteral']
    visitBigIntLiteral?: Visitor['visitBigIntLiteral']
    visitPattern?: Visitor['visitPattern']
    visitRestElement?: Visitor['visitRestElement']
    visitAssignmentPattern?: Visitor['visitAssignmentPattern']
    visitObjectPattern?: Visitor['visitObjectPattern']
    visitObjectPatternProperties?: Visitor['visitObjectPatternProperties']
    visitObjectPatternProperty?: Visitor['visitObjectPatternProperty']
    visitKeyValuePatternProperty?: Visitor['visitKeyValuePatternProperty']
    visitAssignmentPatternProperty?: Visitor['visitAssignmentPatternProperty']
    visitArrayPattern?: Visitor['visitArrayPattern']
    visitArrayPatternElements?: Visitor['visitArrayPatternElements']
    visitArrayPatternElement?: Visitor['visitArrayPatternElement']
  }) {
    super()
    this.handleProgram = context?.visitProgram
    this.handleModule = context?.visitModule
    this.handleScript = context?.visitScript
    this.handleModuleItems = context?.visitModuleItems
    this.handleModuleItem = context?.visitModuleItem
    this.handleModuleDeclaration = context?.visitModuleDeclaration
    this.handleTsNamespaceExportDeclaration = context?.visitTsNamespaceExportDeclaration
    this.handleTsExportAssignment = context?.visitTsExportAssignment
    this.handleTsImportEqualsDeclaration = context?.visitTsImportEqualsDeclaration
    this.handleTsModuleReference = context?.visitTsModuleReference
    this.handleTsExternalModuleReference = context?.visitTsExternalModuleReference
    this.handleExportAllDeclaration = context?.visitExportAllDeclaration
    this.handleExportDefaultExpression = context?.visitExportDefaultExpression
    this.handleExportNamedDeclaration = context?.visitExportNamedDeclaration
    this.handleExportSpecifiers = context?.visitExportSpecifiers
    this.handleExportSpecifier = context?.visitExportSpecifier
    this.handleNamedExportSpecifier = context?.visitNamedExportSpecifier
    this.handleModuleExportName = context?.visitModuleExportName
    this.handleExportNamespaceSpecifier = context?.visitExportNamespaceSpecifier
    this.handleExportDefaultSpecifier = context?.visitExportDefaultSpecifier
    this.handleOptionalStringLiteral = context?.visitOptionalStringLiteral
    this.handleExportDefaultDeclaration = context?.visitExportDefaultDeclaration
    this.handleDefaultDeclaration = context?.visitDefaultDeclaration
    this.handleFunctionExpression = context?.visitFunctionExpression
    this.handleClassExpression = context?.visitClassExpression
    this.handleExportDeclaration = context?.visitExportDeclaration
    this.handleArrayExpression = context?.visitArrayExpression
    this.handleArrayElement = context?.visitArrayElement
    this.handleExprOrSpread = context?.visitExprOrSpread
    this.handleExprOrSpreads = context?.visitExprOrSpreads
    this.handleSpreadElement = context?.visitSpreadElement
    this.handleOptionalExpression = context?.visitOptionalExpression
    this.handleArrowFunctionExpression = context?.visitArrowFunctionExpression
    this.handleArrowBody = context?.visitArrowBody
    this.handleBlockStatement = context?.visitBlockStatement
    this.handleStatements = context?.visitStatements
    this.handleStatement = context?.visitStatement
    this.handleSwitchStatement = context?.visitSwitchStatement
    this.handleSwitchCases = context?.visitSwitchCases
    this.handleSwitchCase = context?.visitSwitchCase
    this.handleIfStatement = context?.visitIfStatement
    this.handleOptionalStatement = context?.visitOptionalStatement
    this.handleBreakStatement = context?.visitBreakStatement
    this.handleWhileStatement = context?.visitWhileStatement
    this.handleTryStatement = context?.visitTryStatement
    this.handleCatchClause = context?.visitCatchClause
    this.handleThrowStatement = context?.visitThrowStatement
    this.handleReturnStatement = context?.visitReturnStatement
    this.handleLabeledStatement = context?.visitLabeledStatement
    this.handleForStatement = context?.visitForStatement
    this.handleForOfStatement = context?.visitForOfStatement
    this.handleForInStatement = context?.visitForInStatement
    this.handleEmptyStatement = context?.visitEmptyStatement
    this.handleDoWhileStatement = context?.visitDoWhileStatement
    this.handleDebuggerStatement = context?.visitDebuggerStatement
    this.handleWithStatement = context?.visitWithStatement
    this.handleDeclaration = context?.visitDeclaration
    this.handleVariableDeclaration = context?.visitVariableDeclaration
    this.handleVariableDeclarators = context?.visitVariableDeclarators
    this.handleVariableDeclarator = context?.visitVariableDeclarator
    this.handleTsTypeAliasDeclaration = context?.visitTsTypeAliasDeclaration
    this.handleTsModuleDeclaration = context?.visitTsModuleDeclaration
    this.handleTsModuleName = context?.visitTsModuleName
    this.handleTsNamespaceBody = context?.visitTsNamespaceBody
    this.handleTsNamespaceDeclaration = context?.visitTsNamespaceDeclaration
    this.handleTsModuleBlock = context?.visitTsModuleBlock
    this.handleTsInterfaceDeclaration = context?.visitTsInterfaceDeclaration
    this.handleTsInterfaceBody = context?.visitTsInterfaceBody
    this.handleTsTypeElements = context?.visitTsTypeElements
    this.handleTsTypeElement = context?.visitTsTypeElement
    this.handleTsCallSignatureDeclaration = context?.visitTsCallSignatureDeclaration
    this.handleTsConstructSignatureDeclaration = context?.visitTsConstructSignatureDeclaration
    this.handleTsPropertySignature = context?.visitTsPropertySignature
    this.handleTsGetterSignature = context?.visitTsGetterSignature
    this.handleTsSetterSignature = context?.visitTsSetterSignature
    this.handleTsMethodSignature = context?.visitTsMethodSignature
    this.handleTsEnumDeclaration = context?.visitTsEnumDeclaration
    this.handleTsEnumMembers = context?.visitTsEnumMembers
    this.handleTsEnumMember = context?.visitTsEnumMember
    this.handleTsEnumMemberId = context?.visitTsEnumMemberId
    this.handleFunctionDeclaration = context?.visitFunctionDeclaration
    this.handleClassDeclaration = context?.visitClassDeclaration
    this.handleClassBody = context?.visitClassBody
    this.handleClassMember = context?.visitClassMember
    this.handleTsIndexSignature = context?.visitTsIndexSignature
    this.handleTsFnParameters = context?.visitTsFnParameters
    this.handleTsFnParameter = context?.visitTsFnParameter
    this.handlePrivateProperty = context?.visitPrivateProperty
    this.handlePrivateMethod = context?.visitPrivateMethod
    this.handlePrivateName = context?.visitPrivateName
    this.handleConstructor = context?.visitConstructor
    this.handleConstructorParameters = context?.visitConstructorParameters
    this.handleConstructorParameter = context?.visitConstructorParameter
    this.handleStaticBlock = context?.visitStaticBlock
    this.handleTsParameterProperty = context?.visitTsParameterProperty
    this.handleTsParameterPropertyParameter = context?.visitTsParameterPropertyParameter
    this.handlePropertyName = context?.visitPropertyName
    this.handleAccessibility = context?.visitAccessibility
    this.handleClassProperty = context?.visitClassProperty
    this.handleClassMethod = context?.visitClassMethod
    this.handleComputedPropertyKey = context?.visitComputedPropertyKey
    this.handleClass = context?.visitClass
    this.handleFunction = context?.visitFunction
    this.handleTsExpressionsWithTypeArguments = context?.visitTsExpressionsWithTypeArguments
    this.handleTsExpressionWithTypeArguments = context?.visitTsExpressionWithTypeArguments
    this.handleTsTypeParameterInstantiation = context?.visitTsTypeParameterInstantiation
    this.handleTsTypes = context?.visitTsTypes
    this.handleTsEntityName = context?.visitTsEntityName
    this.handleTsQualifiedName = context?.visitTsQualifiedName
    this.handleDecorators = context?.visitDecorators
    this.handleDecorator = context?.visitDecorator
    this.handleExpressionStatement = context?.visitExpressionStatement
    this.handleContinueStatement = context?.visitContinueStatement
    this.handleExpression = context?.visitExpression
    this.handleOptionalChainingExpression = context?.visitOptionalChainingExpression
    this.handleMemberExpressionOrOptionalChainingCall = context?.visitMemberExpressionOrOptionalChainingCall
    this.handleOptionalChainingCall = context?.visitOptionalChainingCall
    this.handleAssignmentExpression = context?.visitAssignmentExpression
    this.handlePatternOrExpression = context?.visitPatternOrExpression
    this.handleYieldExpression = context?.visitYieldExpression
    this.handleUpdateExpression = context?.visitUpdateExpression
    this.handleUnaryExpression = context?.visitUnaryExpression
    this.handleTsTypeAssertion = context?.visitTsTypeAssertion
    this.handleTsConstAssertion = context?.visitTsConstAssertion
    this.handleTsInstantiation = context?.visitTsInstantiation
    this.handleTsNonNullExpression = context?.visitTsNonNullExpression
    this.handleTsAsExpression = context?.visitTsAsExpression
    this.handleThisExpression = context?.visitThisExpression
    this.handleTemplateLiteral = context?.visitTemplateLiteral
    this.handleParameters = context?.visitParameters
    this.handleParameter = context?.visitParameter
    this.handleTaggedTemplateExpression = context?.visitTaggedTemplateExpression
    this.handleSequenceExpression = context?.visitSequenceExpression
    this.handleRegExpLiteral = context?.visitRegExpLiteral
    this.handleParenthesisExpression = context?.visitParenthesisExpression
    this.handleObjectExpression = context?.visitObjectExpression
    this.handleObjectProperties = context?.visitObjectProperties
    this.handleObjectProperty = context?.visitObjectProperty
    this.handleProperty = context?.visitProperty
    this.handleSetterProperty = context?.visitSetterProperty
    this.handleMethodProperty = context?.visitMethodProperty
    this.handleKeyValueProperty = context?.visitKeyValueProperty
    this.handleGetterProperty = context?.visitGetterProperty
    this.handleAssignmentProperty = context?.visitAssignmentProperty
    this.handleNullLiteral = context?.visitNullLiteral
    this.handleNewExpression = context?.visitNewExpression
    this.handleTsTypeArguments = context?.visitTsTypeArguments
    this.handleArguments = context?.visitArguments
    this.handleArgument = context?.visitArgument
    this.handleMetaProperty = context?.visitMetaProperty
    this.handleMemberExpression = context?.visitMemberExpression
    this.handleSuperPropExpression = context?.visitSuperPropExpression
    this.handleCallee = context?.visitCallee
    this.handleJSXText = context?.visitJSXText
    this.handleJSXNamespacedName = context?.visitJSXNamespacedName
    this.handleJSXMemberExpression = context?.visitJSXMemberExpression
    this.handleJSXObject = context?.visitJSXObject
    this.handleJSXFragment = context?.visitJSXFragment
    this.handleJSXClosingFragment = context?.visitJSXClosingFragment
    this.handleJSXElementChildren = context?.visitJSXElementChildren
    this.handleJSXElementChild = context?.visitJSXElementChild
    this.handleJSXExpressionContainer = context?.visitJSXExpressionContainer
    this.handleJSXSpreadChild = context?.visitJSXSpreadChild
    this.handleJSXOpeningFragment = context?.visitJSXOpeningFragment
    this.handleJSXEmptyExpression = context?.visitJSXEmptyExpression
    this.handleJSXElement = context?.visitJSXElement
    this.handleJSXClosingElement = context?.visitJSXClosingElement
    this.handleJSXElementName = context?.visitJSXElementName
    this.handleJSXOpeningElement = context?.visitJSXOpeningElement
    this.handleJSXAttributes = context?.visitJSXAttributes
    this.handleJSXAttributeOrSpread = context?.visitJSXAttributeOrSpread
    this.handleJSXAttributeOrSpreads = context?.visitJSXAttributeOrSpreads
    this.handleJSXAttribute = context?.visitJSXAttribute
    this.handleJSXAttributeValue = context?.visitJSXAttributeValue
    this.handleJSXAttributeName = context?.visitJSXAttributeName
    this.handleConditionalExpression = context?.visitConditionalExpression
    this.handleCallExpression = context?.visitCallExpression
    this.handleBooleanLiteral = context?.visitBooleanLiteral
    this.handleBinaryExpression = context?.visitBinaryExpression
    this.handleAwaitExpression = context?.visitAwaitExpression
    this.handleTsTypeParameterDeclaration = context?.visitTsTypeParameterDeclaration
    this.handleTsTypeParameters = context?.visitTsTypeParameters
    this.handleTsTypeParameter = context?.visitTsTypeParameter
    this.handleTsTypeAnnotation = context?.visitTsTypeAnnotation
    this.handleTsType = context?.visitTsType
    this.handlePatterns = context?.visitPatterns
    this.handleImportDeclaration = context?.visitImportDeclaration
    this.handleImportSpecifiers = context?.visitImportSpecifiers
    this.handleImportSpecifier = context?.visitImportSpecifier
    this.handleNamedImportSpecifier = context?.visitNamedImportSpecifier
    this.handleImportNamespaceSpecifier = context?.visitImportNamespaceSpecifier
    this.handleImportDefaultSpecifier = context?.visitImportDefaultSpecifier
    this.handleBindingIdentifier = context?.visitBindingIdentifier
    this.handleIdentifierReference = context?.visitIdentifierReference
    this.handleLabelIdentifier = context?.visitLabelIdentifier
    this.handleIdentifier = context?.visitIdentifier
    this.handleStringLiteral = context?.visitStringLiteral
    this.handleNumericLiteral = context?.visitNumericLiteral
    this.handleBigIntLiteral = context?.visitBigIntLiteral
    this.handlePattern = context?.visitPattern
    this.handleRestElement = context?.visitRestElement
    this.handleAssignmentPattern = context?.visitAssignmentPattern
    this.handleObjectPattern = context?.visitObjectPattern
    this.handleObjectPatternProperties = context?.visitObjectPatternProperties
    this.handleObjectPatternProperty = context?.visitObjectPatternProperty
    this.handleKeyValuePatternProperty = context?.visitKeyValuePatternProperty
    this.handleAssignmentPatternProperty = context?.visitAssignmentPatternProperty
    this.handleArrayPattern = context?.visitArrayPattern
    this.handleArrayPatternElements = context?.visitArrayPatternElements
    this.handleArrayPatternElement = context?.visitArrayPatternElement
  }

  override visitProgram(m: Program): Program {
    this.handleProgram?.(m)
    return super.visitProgram(m)
  }
  override visitModule(m: Module): Module {
    this.handleModule?.(m)
    return super.visitModule(m)
  }
  override visitScript(m: Script): Script {
    this.handleScript?.(m)
    return super.visitScript(m)
  }
  override visitModuleItems(items: ModuleItem[]): ModuleItem[] {
    this.handleModuleItems?.(items)
    return super.visitModuleItems(items)
  }
  override visitModuleItem(n: ModuleItem): ModuleItem {
    this.handleModuleItem?.(n)
    return super.visitModuleItem(n)
  }
  override visitModuleDeclaration(n: ModuleDeclaration): ModuleDeclaration {
    this.handleModuleDeclaration?.(n)
    return super.visitModuleDeclaration(n)
  }
  override visitTsNamespaceExportDeclaration(n: TsNamespaceExportDeclaration): ModuleDeclaration {
    this.handleTsNamespaceExportDeclaration?.(n)
    return super.visitTsNamespaceExportDeclaration(n)
  }
  override visitTsExportAssignment(n: TsExportAssignment): TsExportAssignment {
    this.handleTsExportAssignment?.(n)
    return super.visitTsExportAssignment(n)
  }
  override visitTsImportEqualsDeclaration(n: TsImportEqualsDeclaration): ModuleDeclaration {
    this.handleTsImportEqualsDeclaration?.(n)
    return super.visitTsImportEqualsDeclaration(n)
  }
  override visitTsModuleReference(n: TsModuleReference): TsModuleReference {
    this.handleTsModuleReference?.(n)
    return super.visitTsModuleReference(n)
  }
  override visitTsExternalModuleReference(n: TsExternalModuleReference): TsExternalModuleReference {
    this.handleTsExternalModuleReference?.(n)
    return super.visitTsExternalModuleReference(n)
  }
  override visitExportAllDeclaration(n: ExportAllDeclaration): ModuleDeclaration {
    this.handleExportAllDeclaration?.(n)
    return super.visitExportAllDeclaration(n)
  }
  override visitExportDefaultExpression(n: ExportDefaultExpression): ModuleDeclaration {
    this.handleExportDefaultExpression?.(n)
    return super.visitExportDefaultExpression(n)
  }
  override visitExportNamedDeclaration(n: ExportNamedDeclaration): ModuleDeclaration {
    this.handleExportNamedDeclaration?.(n)
    return super.visitExportNamedDeclaration(n)
  }
  override visitExportSpecifiers(nodes: ExportSpecifier[]): ExportSpecifier[] {
    this.handleExportSpecifiers?.(nodes)
    return super.visitExportSpecifiers(nodes)
  }
  override visitExportSpecifier(n: ExportSpecifier): ExportSpecifier {
    this.handleExportSpecifier?.(n)
    return super.visitExportSpecifier(n)
  }
  override visitNamedExportSpecifier(n: NamedExportSpecifier): ExportSpecifier {
    this.handleNamedExportSpecifier?.(n)
    return super.visitNamedExportSpecifier(n)
  }
  override visitModuleExportName(n: ModuleExportName): ModuleExportName {
    this.handleModuleExportName?.(n)
    return super.visitModuleExportName(n)
  }
  override visitExportNamespaceSpecifier(n: ExportNamespaceSpecifier): ExportSpecifier {
    this.handleExportNamespaceSpecifier?.(n)
    return super.visitExportNamespaceSpecifier(n)
  }
  override visitExportDefaultSpecifier(n: ExportDefaultSpecifier): ExportSpecifier {
    this.handleExportDefaultSpecifier?.(n)
    return super.visitExportDefaultSpecifier(n)
  }
  override visitOptionalStringLiteral(n: StringLiteral | undefined): StringLiteral | undefined {
    this.handleOptionalStringLiteral?.(n)
    return super.visitOptionalStringLiteral(n)
  }
  override visitExportDefaultDeclaration(n: ExportDefaultDeclaration): ModuleDeclaration {
    this.handleExportDefaultDeclaration?.(n)
    return super.visitExportDefaultDeclaration(n)
  }
  override visitDefaultDeclaration(n: DefaultDecl): DefaultDecl {
    this.handleDefaultDeclaration?.(n)
    return super.visitDefaultDeclaration(n)
  }
  override visitFunctionExpression(n: FunctionExpression): FunctionExpression {
    this.handleFunctionExpression?.(n)
    return super.visitFunctionExpression(n)
  }
  override visitClassExpression(n: ClassExpression): ClassExpression {
    this.handleClassExpression?.(n)
    return super.visitClassExpression(n)
  }
  override visitExportDeclaration(n: ExportDeclaration): ModuleDeclaration {
    this.handleExportDeclaration?.(n)
    return super.visitExportDeclaration(n)
  }
  override visitArrayExpression(e: ArrayExpression): Expression {
    this.handleArrayExpression?.(e)
    return super.visitArrayExpression(e)
  }
  override visitArrayElement(e: ExprOrSpread | undefined): ExprOrSpread | undefined {
    this.handleArrayElement?.(e)
    return super.visitArrayElement(e)
  }
  override visitExprOrSpread(e: ExprOrSpread): ExprOrSpread {
    this.handleExprOrSpread?.(e)
    return super.visitExprOrSpread(e)
  }
  override visitExprOrSpreads(nodes: ExprOrSpread[]): ExprOrSpread[] {
    this.handleExprOrSpreads?.(nodes)
    return super.visitExprOrSpreads(nodes)
  }
  override visitSpreadElement(e: SpreadElement): SpreadElement {
    this.handleSpreadElement?.(e)
    return super.visitSpreadElement(e)
  }
  override visitOptionalExpression(e: Expression | undefined): Expression | undefined {
    this.handleOptionalExpression?.(e)
    return super.visitOptionalExpression(e)
  }
  override visitArrowFunctionExpression(e: ArrowFunctionExpression): Expression {
    this.handleArrowFunctionExpression?.(e)
    return super.visitArrowFunctionExpression(e)
  }
  override visitArrowBody(body: BlockStatement | Expression): BlockStatement | Expression {
    this.handleArrowBody?.(body)
    return super.visitArrowBody(body)
  }
  override visitBlockStatement(block: BlockStatement): BlockStatement {
    this.handleBlockStatement?.(block)
    return super.visitBlockStatement(block)
  }
  override visitStatements(stmts: Statement[]): Statement[] {
    this.handleStatements?.(stmts)
    return super.visitStatements(stmts)
  }
  override visitStatement(stmt: Statement): Statement {
    this.handleStatement?.(stmt)
    return super.visitStatement(stmt)
  }
  override visitSwitchStatement(stmt: SwitchStatement): Statement {
    this.handleSwitchStatement?.(stmt)
    return super.visitSwitchStatement(stmt)
  }
  override visitSwitchCases(cases: SwitchCase[]): SwitchCase[] {
    this.handleSwitchCases?.(cases)
    return super.visitSwitchCases(cases)
  }
  override visitSwitchCase(c: SwitchCase): SwitchCase {
    this.handleSwitchCase?.(c)
    return super.visitSwitchCase(c)
  }
  override visitIfStatement(stmt: IfStatement): Statement {
    this.handleIfStatement?.(stmt)
    return super.visitIfStatement(stmt)
  }
  override visitOptionalStatement(stmt: Statement | undefined): Statement | undefined {
    this.handleOptionalStatement?.(stmt)
    return super.visitOptionalStatement(stmt)
  }
  override visitBreakStatement(stmt: BreakStatement): Statement {
    this.handleBreakStatement?.(stmt)
    return super.visitBreakStatement(stmt)
  }
  override visitWhileStatement(stmt: WhileStatement): Statement {
    this.handleWhileStatement?.(stmt)
    return super.visitWhileStatement(stmt)
  }
  override visitTryStatement(stmt: TryStatement): Statement {
    this.handleTryStatement?.(stmt)
    return super.visitTryStatement(stmt)
  }
  override visitCatchClause(handler: CatchClause | undefined): CatchClause | undefined {
    this.handleCatchClause?.(handler)
    return super.visitCatchClause(handler)
  }
  override visitThrowStatement(stmt: ThrowStatement): Statement {
    this.handleThrowStatement?.(stmt)
    return super.visitThrowStatement(stmt)
  }
  override visitReturnStatement(stmt: ReturnStatement): Statement {
    this.handleReturnStatement?.(stmt)
    return super.visitReturnStatement(stmt)
  }
  override visitLabeledStatement(stmt: LabeledStatement): Statement {
    this.handleLabeledStatement?.(stmt)
    return super.visitLabeledStatement(stmt)
  }
  override visitForStatement(stmt: ForStatement): Statement {
    this.handleForStatement?.(stmt)
    return super.visitForStatement(stmt)
  }
  override visitForOfStatement(stmt: ForOfStatement): Statement {
    this.handleForOfStatement?.(stmt)
    return super.visitForOfStatement(stmt)
  }
  override visitForInStatement(stmt: ForInStatement): Statement {
    this.handleForInStatement?.(stmt)
    return super.visitForInStatement(stmt)
  }
  override visitEmptyStatement(stmt: EmptyStatement): EmptyStatement {
    this.handleEmptyStatement?.(stmt)
    return super.visitEmptyStatement(stmt)
  }
  override visitDoWhileStatement(stmt: DoWhileStatement): Statement {
    this.handleDoWhileStatement?.(stmt)
    return super.visitDoWhileStatement(stmt)
  }
  override visitDebuggerStatement(stmt: DebuggerStatement): Statement {
    this.handleDebuggerStatement?.(stmt)
    return super.visitDebuggerStatement(stmt)
  }
  override visitWithStatement(stmt: WithStatement): Statement {
    this.handleWithStatement?.(stmt)
    return super.visitWithStatement(stmt)
  }
  override visitDeclaration(decl: Declaration): Declaration {
    this.handleDeclaration?.(decl)
    return super.visitDeclaration(decl)
  }
  override visitVariableDeclaration(n: VariableDeclaration): VariableDeclaration {
    this.handleVariableDeclaration?.(n)
    return super.visitVariableDeclaration(n)
  }
  override visitVariableDeclarators(nodes: VariableDeclarator[]): VariableDeclarator[] {
    this.handleVariableDeclarators?.(nodes)
    return super.visitVariableDeclarators(nodes)
  }
  override visitVariableDeclarator(n: VariableDeclarator): VariableDeclarator {
    this.handleVariableDeclarator?.(n)
    return super.visitVariableDeclarator(n)
  }
  override visitTsTypeAliasDeclaration(n: TsTypeAliasDeclaration): Declaration {
    this.handleTsTypeAliasDeclaration?.(n)
    return super.visitTsTypeAliasDeclaration(n)
  }
  override visitTsModuleDeclaration(n: TsModuleDeclaration): Declaration {
    this.handleTsModuleDeclaration?.(n)
    return super.visitTsModuleDeclaration(n)
  }
  override visitTsModuleName(n: TsModuleName): TsModuleName {
    this.handleTsModuleName?.(n)
    return super.visitTsModuleName(n)
  }
  override visitTsNamespaceBody(n: TsNamespaceBody): TsNamespaceBody | undefined {
    this.handleTsNamespaceBody?.(n)
    return super.visitTsNamespaceBody(n)
  }
  override visitTsNamespaceDeclaration(n: TsNamespaceDeclaration): TsModuleBlock | TsNamespaceDeclaration {
    this.handleTsNamespaceDeclaration?.(n)
    return super.visitTsNamespaceDeclaration(n)
  }
  override visitTsModuleBlock(n: TsModuleBlock): TsModuleBlock | TsNamespaceDeclaration {
    this.handleTsModuleBlock?.(n)
    return super.visitTsModuleBlock(n)
  }
  override visitTsInterfaceDeclaration(n: TsInterfaceDeclaration): TsInterfaceDeclaration {
    this.handleTsInterfaceDeclaration?.(n)
    return super.visitTsInterfaceDeclaration(n)
  }
  override visitTsInterfaceBody(n: TsInterfaceBody): TsInterfaceBody {
    this.handleTsInterfaceBody?.(n)
    return super.visitTsInterfaceBody(n)
  }
  override visitTsTypeElements(nodes: TsTypeElement[]): TsTypeElement[] {
    this.handleTsTypeElements?.(nodes)
    return super.visitTsTypeElements(nodes)
  }
  override visitTsTypeElement(n: TsTypeElement): TsTypeElement {
    this.handleTsTypeElement?.(n)
    return super.visitTsTypeElement(n)
  }
  override visitTsCallSignatureDeclaration(n: TsCallSignatureDeclaration): TsCallSignatureDeclaration {
    this.handleTsCallSignatureDeclaration?.(n)
    return super.visitTsCallSignatureDeclaration(n)
  }
  override visitTsConstructSignatureDeclaration(n: TsConstructSignatureDeclaration): TsConstructSignatureDeclaration {
    this.handleTsConstructSignatureDeclaration?.(n)
    return super.visitTsConstructSignatureDeclaration(n)
  }
  override visitTsPropertySignature(n: TsPropertySignature): TsPropertySignature {
    this.handleTsPropertySignature?.(n)
    return super.visitTsPropertySignature(n)
  }
  override visitTsGetterSignature(n: TsGetterSignature): TsGetterSignature {
    this.handleTsGetterSignature?.(n)
    return super.visitTsGetterSignature(n)
  }
  override visitTsSetterSignature(n: TsSetterSignature): TsSetterSignature {
    this.handleTsSetterSignature?.(n)
    return super.visitTsSetterSignature(n)
  }
  override visitTsMethodSignature(n: TsMethodSignature): TsMethodSignature {
    this.handleTsMethodSignature?.(n)
    return super.visitTsMethodSignature(n)
  }
  override visitTsEnumDeclaration(n: TsEnumDeclaration): Declaration {
    this.handleTsEnumDeclaration?.(n)
    return super.visitTsEnumDeclaration(n)
  }
  override visitTsEnumMembers(nodes: TsEnumMember[]): TsEnumMember[] {
    this.handleTsEnumMembers?.(nodes)
    return super.visitTsEnumMembers(nodes)
  }
  override visitTsEnumMember(n: TsEnumMember): TsEnumMember {
    this.handleTsEnumMember?.(n)
    return super.visitTsEnumMember(n)
  }
  override visitTsEnumMemberId(n: TsEnumMemberId): TsEnumMemberId {
    this.handleTsEnumMemberId?.(n)
    return super.visitTsEnumMemberId(n)
  }
  override visitFunctionDeclaration(decl: FunctionDeclaration): Declaration {
    this.handleFunctionDeclaration?.(decl)
    return super.visitFunctionDeclaration(decl)
  }
  override visitClassDeclaration(decl: ClassDeclaration): Declaration {
    this.handleClassDeclaration?.(decl)
    return super.visitClassDeclaration(decl)
  }
  override visitClassBody(members: ClassMember[]): ClassMember[] {
    this.handleClassBody?.(members)
    return super.visitClassBody(members)
  }
  override visitClassMember(member: ClassMember): ClassMember {
    this.handleClassMember?.(member)
    return super.visitClassMember(member)
  }
  override visitTsIndexSignature(n: TsIndexSignature): TsIndexSignature {
    this.handleTsIndexSignature?.(n)
    return super.visitTsIndexSignature(n)
  }
  override visitTsFnParameters(params: TsFnParameter[]): TsFnParameter[] {
    this.handleTsFnParameters?.(params)
    return super.visitTsFnParameters(params)
  }
  override visitTsFnParameter(n: TsFnParameter): TsFnParameter {
    this.handleTsFnParameter?.(n)
    return super.visitTsFnParameter(n)
  }
  override visitPrivateProperty(n: PrivateProperty): ClassMember {
    this.handlePrivateProperty?.(n)
    return super.visitPrivateProperty(n)
  }
  override visitPrivateMethod(n: PrivateMethod): ClassMember {
    this.handlePrivateMethod?.(n)
    return super.visitPrivateMethod(n)
  }
  override visitPrivateName(n: PrivateName): PrivateName {
    this.handlePrivateName?.(n)
    return super.visitPrivateName(n)
  }
  override visitConstructor(n: Constructor): ClassMember {
    this.handleConstructor?.(n)
    return super.visitConstructor(n)
  }
  override visitConstructorParameters(nodes: (Param | TsParameterProperty)[]): (Param | TsParameterProperty)[] {
    this.handleConstructorParameters?.(nodes)
    return super.visitConstructorParameters(nodes)
  }
  override visitConstructorParameter(n: Param | TsParameterProperty): Param | TsParameterProperty {
    this.handleConstructorParameter?.(n)
    return super.visitConstructorParameter(n)
  }
  override visitStaticBlock(n: StaticBlock): StaticBlock {
    this.handleStaticBlock?.(n)
    return super.visitStaticBlock(n)
  }
  override visitTsParameterProperty(n: TsParameterProperty): TsParameterProperty | Param {
    this.handleTsParameterProperty?.(n)
    return super.visitTsParameterProperty(n)
  }
  override visitTsParameterPropertyParameter(n: TsParameterPropertyParameter): TsParameterPropertyParameter {
    this.handleTsParameterPropertyParameter?.(n)
    return super.visitTsParameterPropertyParameter(n)
  }
  override visitPropertyName(key: PropertyName): PropertyName {
    this.handlePropertyName?.(key)
    return super.visitPropertyName(key)
  }
  override visitAccessibility(n: Accessibility | undefined): Accessibility | undefined {
    this.handleAccessibility?.(n)
    return super.visitAccessibility(n)
  }
  override visitClassProperty(n: ClassProperty): ClassMember {
    this.handleClassProperty?.(n)
    return super.visitClassProperty(n)
  }
  override visitClassMethod(n: ClassMethod): ClassMember {
    this.handleClassMethod?.(n)
    return super.visitClassMethod(n)
  }
  override visitComputedPropertyKey(n: ComputedPropName): ComputedPropName {
    this.handleComputedPropertyKey?.(n)
    return super.visitComputedPropertyKey(n)
  }
  override visitClass<T extends Class>(n: T): T {
    this.handleClass?.(n)
    return super.visitClass(n)
  }
  override visitFunction<T extends Fn>(n: T): T {
    this.handleFunction?.(n)
    return super.visitFunction(n)
  }
  override visitTsExpressionsWithTypeArguments(nodes: TsExpressionWithTypeArguments[]): TsExpressionWithTypeArguments[] {
    this.handleTsExpressionsWithTypeArguments?.(nodes)
    return super.visitTsExpressionsWithTypeArguments(nodes)
  }
  override visitTsExpressionWithTypeArguments(n: TsExpressionWithTypeArguments): TsExpressionWithTypeArguments {
    this.handleTsExpressionWithTypeArguments?.(n)
    return super.visitTsExpressionWithTypeArguments(n)
  }
  override visitTsTypeParameterInstantiation(n: TsTypeParameterInstantiation | undefined): TsTypeParameterInstantiation | undefined {
    this.handleTsTypeParameterInstantiation?.(n)
    return super.visitTsTypeParameterInstantiation(n)
  }
  override visitTsTypes(nodes: TsType[]): TsType[] {
    this.handleTsTypes?.(nodes)
    return super.visitTsTypes(nodes)
  }
  override visitTsEntityName(n: TsEntityName): TsEntityName {
    this.handleTsEntityName?.(n)
    return super.visitTsEntityName(n)
  }
  override visitTsQualifiedName(n: TsQualifiedName): TsQualifiedName {
    this.handleTsQualifiedName?.(n)
    return super.visitTsQualifiedName(n)
  }
  override visitDecorators(nodes: Decorator[] | undefined): Decorator[] | undefined {
    this.handleDecorators?.(nodes)
    return super.visitDecorators(nodes)
  }
  override visitDecorator(n: Decorator): Decorator {
    this.handleDecorator?.(n)
    return super.visitDecorator(n)
  }
  override visitExpressionStatement(stmt: ExpressionStatement): Statement {
    this.handleExpressionStatement?.(stmt)
    return super.visitExpressionStatement(stmt)
  }
  override visitContinueStatement(stmt: ContinueStatement): Statement {
    this.handleContinueStatement?.(stmt)
    return super.visitContinueStatement(stmt)
  }
  override visitExpression(n: Expression): Expression {
    this.handleExpression?.(n)
    return super.visitExpression(n)
  }
  override visitOptionalChainingExpression(n: OptionalChainingExpression): Expression {
    this.handleOptionalChainingExpression?.(n)
    return super.visitOptionalChainingExpression(n)
  }
  override visitMemberExpressionOrOptionalChainingCall(n: MemberExpression | OptionalChainingCall): MemberExpression | OptionalChainingCall {
    this.handleMemberExpressionOrOptionalChainingCall?.(n)
    return super.visitMemberExpressionOrOptionalChainingCall(n)
  }
  override visitOptionalChainingCall(n: OptionalChainingCall): OptionalChainingCall {
    this.handleOptionalChainingCall?.(n)
    return super.visitOptionalChainingCall(n)
  }
  override visitAssignmentExpression(n: AssignmentExpression): Expression {
    this.handleAssignmentExpression?.(n)
    return super.visitAssignmentExpression(n)
  }
  override visitPatternOrExpression(n: Pattern | Expression): Pattern | Expression {
    this.handlePatternOrExpression?.(n)
    return super.visitPatternOrExpression(n)
  }
  override visitYieldExpression(n: YieldExpression): Expression {
    this.handleYieldExpression?.(n)
    return super.visitYieldExpression(n)
  }
  override visitUpdateExpression(n: UpdateExpression): Expression {
    this.handleUpdateExpression?.(n)
    return super.visitUpdateExpression(n)
  }
  override visitUnaryExpression(n: UnaryExpression): Expression {
    this.handleUnaryExpression?.(n)
    return super.visitUnaryExpression(n)
  }
  override visitTsTypeAssertion(n: TsTypeAssertion): Expression {
    this.handleTsTypeAssertion?.(n)
    return super.visitTsTypeAssertion(n)
  }
  override visitTsConstAssertion(n: TsConstAssertion): Expression {
    this.handleTsConstAssertion?.(n)
    return super.visitTsConstAssertion(n)
  }
  override visitTsInstantiation(n: TsInstantiation): TsInstantiation {
    this.handleTsInstantiation?.(n)
    return super.visitTsInstantiation(n)
  }
  override visitTsNonNullExpression(n: TsNonNullExpression): Expression {
    this.handleTsNonNullExpression?.(n)
    return super.visitTsNonNullExpression(n)
  }
  override visitTsAsExpression(n: TsAsExpression): Expression {
    this.handleTsAsExpression?.(n)
    return super.visitTsAsExpression(n)
  }
  override visitThisExpression(n: ThisExpression): Expression {
    this.handleThisExpression?.(n)
    return super.visitThisExpression(n)
  }
  override visitTemplateLiteral(n: TemplateLiteral): Expression {
    this.handleTemplateLiteral?.(n)
    return super.visitTemplateLiteral(n)
  }
  override visitParameters(n: Param[]): Param[] {
    this.handleParameters?.(n)
    return super.visitParameters(n)
  }
  override visitParameter(n: Param): Param {
    this.handleParameter?.(n)
    return super.visitParameter(n)
  }
  override visitTaggedTemplateExpression(n: TaggedTemplateExpression): Expression {
    this.handleTaggedTemplateExpression?.(n)
    return super.visitTaggedTemplateExpression(n)
  }
  override visitSequenceExpression(n: SequenceExpression): Expression {
    this.handleSequenceExpression?.(n)
    return super.visitSequenceExpression(n)
  }
  override visitRegExpLiteral(n: RegExpLiteral): Expression {
    this.handleRegExpLiteral?.(n)
    return super.visitRegExpLiteral(n)
  }
  override visitParenthesisExpression(n: ParenthesisExpression): Expression {
    this.handleParenthesisExpression?.(n)
    return super.visitParenthesisExpression(n)
  }
  override visitObjectExpression(n: ObjectExpression): Expression {
    this.handleObjectExpression?.(n)
    return super.visitObjectExpression(n)
  }
  override visitObjectProperties(nodes: (Property | SpreadElement)[]): (Property | SpreadElement)[] {
    this.handleObjectProperties?.(nodes)
    return super.visitObjectProperties(nodes)
  }
  override visitObjectProperty(n: Property | SpreadElement): Property | SpreadElement {
    this.handleObjectProperty?.(n)
    return super.visitObjectProperty(n)
  }
  override visitProperty(n: Property): Property | SpreadElement {
    this.handleProperty?.(n)
    return super.visitProperty(n)
  }
  override visitSetterProperty(n: SetterProperty): Property | SpreadElement {
    this.handleSetterProperty?.(n)
    return super.visitSetterProperty(n)
  }
  override visitMethodProperty(n: MethodProperty): Property | SpreadElement {
    this.handleMethodProperty?.(n)
    return super.visitMethodProperty(n)
  }
  override visitKeyValueProperty(n: KeyValueProperty): Property | SpreadElement {
    this.handleKeyValueProperty?.(n)
    return super.visitKeyValueProperty(n)
  }
  override visitGetterProperty(n: GetterProperty): Property | SpreadElement {
    this.handleGetterProperty?.(n)
    return super.visitGetterProperty(n)
  }
  override visitAssignmentProperty(n: AssignmentProperty): Property | SpreadElement {
    this.handleAssignmentProperty?.(n)
    return super.visitAssignmentProperty(n)
  }
  override visitNullLiteral(n: NullLiteral): NullLiteral {
    this.handleNullLiteral?.(n)
    return super.visitNullLiteral(n)
  }
  override visitNewExpression(n: NewExpression): Expression {
    this.handleNewExpression?.(n)
    return super.visitNewExpression(n)
  }
  override visitTsTypeArguments(n: TsTypeParameterInstantiation | undefined): TsTypeParameterInstantiation | undefined {
    this.handleTsTypeArguments?.(n)
    return super.visitTsTypeArguments(n)
  }
  override visitArguments(nodes: Argument[]): Argument[] {
    this.handleArguments?.(nodes)
    return super.visitArguments(nodes)
  }
  override visitArgument(n: Argument): Argument {
    this.handleArgument?.(n)
    return super.visitArgument(n)
  }
  override visitMetaProperty(n: MetaProperty): Expression {
    this.handleMetaProperty?.(n)
    return super.visitMetaProperty(n)
  }
  override visitMemberExpression(n: MemberExpression): MemberExpression {
    this.handleMemberExpression?.(n)
    return super.visitMemberExpression(n)
  }
  override visitSuperPropExpression(n: SuperPropExpression): Expression {
    this.handleSuperPropExpression?.(n)
    return super.visitSuperPropExpression(n)
  }
  override visitCallee(n: Expression | Super | Import): Expression | Super | Import {
    this.handleCallee?.(n)
    return super.visitCallee(n)
  }
  override visitJSXText(n: JSXText): JSXText {
    this.handleJSXText?.(n)
    return super.visitJSXText(n)
  }
  override visitJSXNamespacedName(n: JSXNamespacedName): JSXNamespacedName {
    this.handleJSXNamespacedName?.(n)
    return super.visitJSXNamespacedName(n)
  }
  override visitJSXMemberExpression(n: JSXMemberExpression): JSXMemberExpression {
    this.handleJSXMemberExpression?.(n)
    return super.visitJSXMemberExpression(n)
  }
  override visitJSXObject(n: JSXObject): JSXObject {
    this.handleJSXObject?.(n)
    return super.visitJSXObject(n)
  }
  override visitJSXFragment(n: JSXFragment): JSXFragment {
    this.handleJSXFragment?.(n)
    return super.visitJSXFragment(n)
  }
  override visitJSXClosingFragment(n: JSXClosingFragment): JSXClosingFragment {
    this.handleJSXClosingFragment?.(n)
    return super.visitJSXClosingFragment(n)
  }
  override visitJSXElementChildren(nodes: JSXElementChild[]): JSXElementChild[] {
    this.handleJSXElementChildren?.(nodes)
    return super.visitJSXElementChildren(nodes)
  }
  override visitJSXElementChild(n: JSXElementChild): JSXElementChild {
    this.handleJSXElementChild?.(n)
    return super.visitJSXElementChild(n)
  }
  override visitJSXExpressionContainer(n: JSXExpressionContainer): JSXExpressionContainer {
    this.handleJSXExpressionContainer?.(n)
    return super.visitJSXExpressionContainer(n)
  }
  override visitJSXSpreadChild(n: JSXSpreadChild): JSXElementChild {
    this.handleJSXSpreadChild?.(n)
    return super.visitJSXSpreadChild(n)
  }
  override visitJSXOpeningFragment(n: JSXOpeningFragment): JSXOpeningFragment {
    this.handleJSXOpeningFragment?.(n)
    return super.visitJSXOpeningFragment(n)
  }
  override visitJSXEmptyExpression(n: JSXEmptyExpression): Expression {
    this.handleJSXEmptyExpression?.(n)
    return super.visitJSXEmptyExpression(n)
  }
  override visitJSXElement(n: JSXElement): JSXElement {
    this.handleJSXElement?.(n)
    return super.visitJSXElement(n)
  }
  override visitJSXClosingElement(n: JSXClosingElement | undefined): JSXClosingElement | undefined {
    this.handleJSXClosingElement?.(n)
    return super.visitJSXClosingElement(n)
  }
  override visitJSXElementName(n: JSXElementName): JSXElementName {
    this.handleJSXElementName?.(n)
    return super.visitJSXElementName(n)
  }
  override visitJSXOpeningElement(n: JSXOpeningElement): JSXOpeningElement {
    this.handleJSXOpeningElement?.(n)
    return super.visitJSXOpeningElement(n)
  }
  override visitJSXAttributes(attrs: JSXAttributeOrSpread[] | undefined): JSXAttributeOrSpread[] | undefined {
    this.handleJSXAttributes?.(attrs)
    return super.visitJSXAttributes(attrs)
  }
  override visitJSXAttributeOrSpread(n: JSXAttributeOrSpread): JSXAttributeOrSpread {
    this.handleJSXAttributeOrSpread?.(n)
    return super.visitJSXAttributeOrSpread(n)
  }
  override visitJSXAttributeOrSpreads(nodes: JSXAttributeOrSpread[]): JSXAttributeOrSpread[] {
    this.handleJSXAttributeOrSpreads?.(nodes)
    return super.visitJSXAttributeOrSpreads(nodes)
  }
  override visitJSXAttribute(n: JSXAttribute): JSXAttributeOrSpread {
    this.handleJSXAttribute?.(n)
    return super.visitJSXAttribute(n)
  }
  override visitJSXAttributeValue(n: JSXAttrValue | undefined): JSXAttrValue | undefined {
    this.handleJSXAttributeValue?.(n)
    return super.visitJSXAttributeValue(n)
  }
  override visitJSXAttributeName(n: JSXAttributeName): JSXAttributeName {
    this.handleJSXAttributeName?.(n)
    return super.visitJSXAttributeName(n)
  }
  override visitConditionalExpression(n: ConditionalExpression): Expression {
    this.handleConditionalExpression?.(n)
    return super.visitConditionalExpression(n)
  }
  override visitCallExpression(n: CallExpression): Expression {
    this.handleCallExpression?.(n)
    return super.visitCallExpression(n)
  }
  override visitBooleanLiteral(n: BooleanLiteral): BooleanLiteral {
    this.handleBooleanLiteral?.(n)
    return super.visitBooleanLiteral(n)
  }
  override visitBinaryExpression(n: BinaryExpression): Expression {
    this.handleBinaryExpression?.(n)
    return super.visitBinaryExpression(n)
  }
  override visitAwaitExpression(n: AwaitExpression): Expression {
    this.handleAwaitExpression?.(n)
    return super.visitAwaitExpression(n)
  }
  override visitTsTypeParameterDeclaration(n: TsTypeParameterDeclaration | undefined): TsTypeParameterDeclaration | undefined {
    this.handleTsTypeParameterDeclaration?.(n)
    return super.visitTsTypeParameterDeclaration(n)
  }
  override visitTsTypeParameters(nodes: TsTypeParameter[]): TsTypeParameter[] {
    this.handleTsTypeParameters?.(nodes)
    return super.visitTsTypeParameters(nodes)
  }
  override visitTsTypeParameter(n: TsTypeParameter): TsTypeParameter {
    this.handleTsTypeParameter?.(n)
    return super.visitTsTypeParameter(n)
  }
  override visitTsTypeAnnotation(a: TsTypeAnnotation | undefined): TsTypeAnnotation | undefined {
    this.handleTsTypeAnnotation?.(a)
    return super.visitTsTypeAnnotation(a)
  }
  override visitTsType(n: TsType): TsType {
    this.handleTsType?.(n)
    return super.visitTsType(n)
  }
  override visitPatterns(nodes: Pattern[]): Pattern[] {
    this.handlePatterns?.(nodes)
    return super.visitPatterns(nodes)
  }
  override visitImportDeclaration(n: ImportDeclaration): ImportDeclaration {
    this.handleImportDeclaration?.(n)
    return super.visitImportDeclaration(n)
  }
  override visitImportSpecifiers(nodes: ImportSpecifier[]): ImportSpecifier[] {
    this.handleImportSpecifiers?.(nodes)
    return super.visitImportSpecifiers(nodes)
  }
  override visitImportSpecifier(node: ImportSpecifier): ImportSpecifier {
    this.handleImportSpecifier?.(node)
    return super.visitImportSpecifier(node)
  }
  override visitNamedImportSpecifier(node: NamedImportSpecifier): NamedImportSpecifier {
    this.handleNamedImportSpecifier?.(node)
    return super.visitNamedImportSpecifier(node)
  }
  override visitImportNamespaceSpecifier(node: ImportNamespaceSpecifier): ImportNamespaceSpecifier {
    this.handleImportNamespaceSpecifier?.(node)
    return super.visitImportNamespaceSpecifier(node)
  }
  override visitImportDefaultSpecifier(node: ImportDefaultSpecifier): ImportSpecifier {
    this.handleImportDefaultSpecifier?.(node)
    return super.visitImportDefaultSpecifier(node)
  }
  override visitBindingIdentifier(i: BindingIdentifier): BindingIdentifier {
    this.handleBindingIdentifier?.(i)
    return super.visitBindingIdentifier(i)
  }
  override visitIdentifierReference(i: Identifier): Identifier {
    this.handleIdentifierReference?.(i)
    return super.visitIdentifierReference(i)
  }
  override visitLabelIdentifier(label: Identifier): Identifier {
    this.handleLabelIdentifier?.(label)
    return super.visitLabelIdentifier(label)
  }
  override visitIdentifier(n: Identifier): Identifier {
    this.handleIdentifier?.(n)
    return super.visitIdentifier(n)
  }
  override visitStringLiteral(n: StringLiteral): StringLiteral {
    this.handleStringLiteral?.(n)
    return super.visitStringLiteral(n)
  }
  override visitNumericLiteral(n: NumericLiteral): NumericLiteral {
    this.handleNumericLiteral?.(n)
    return super.visitNumericLiteral(n)
  }
  override visitBigIntLiteral(n: BigIntLiteral): BigIntLiteral {
    this.handleBigIntLiteral?.(n)
    return super.visitBigIntLiteral(n)
  }
  override visitPattern(n: Pattern): Pattern {
    this.handlePattern?.(n)
    return super.visitPattern(n)
  }
  override visitRestElement(n: RestElement): RestElement {
    this.handleRestElement?.(n)
    return super.visitRestElement(n)
  }
  override visitAssignmentPattern(n: AssignmentPattern): Pattern {
    this.handleAssignmentPattern?.(n)
    return super.visitAssignmentPattern(n)
  }
  override visitObjectPattern(n: ObjectPattern): Pattern {
    this.handleObjectPattern?.(n)
    return super.visitObjectPattern(n)
  }
  override visitObjectPatternProperties(nodes: ObjectPatternProperty[]): ObjectPatternProperty[] {
    this.handleObjectPatternProperties?.(nodes)
    return super.visitObjectPatternProperties(nodes)
  }
  override visitObjectPatternProperty(n: ObjectPatternProperty): ObjectPatternProperty {
    this.handleObjectPatternProperty?.(n)
    return super.visitObjectPatternProperty(n)
  }
  override visitKeyValuePatternProperty(n: KeyValuePatternProperty): ObjectPatternProperty {
    this.handleKeyValuePatternProperty?.(n)
    return super.visitKeyValuePatternProperty(n)
  }
  override visitAssignmentPatternProperty(n: AssignmentPatternProperty): ObjectPatternProperty {
    this.handleAssignmentPatternProperty?.(n)
    return super.visitAssignmentPatternProperty(n)
  }
  override visitArrayPattern(n: ArrayPattern): Pattern {
    this.handleArrayPattern?.(n)
    return super.visitArrayPattern(n)
  }
  override visitArrayPatternElements(nodes: (Pattern | undefined)[]): (Pattern | undefined)[] {
    this.handleArrayPatternElements?.(nodes)
    return super.visitArrayPatternElements(nodes)
  }
  override visitArrayPatternElement(m: Pattern | undefined): Pattern | undefined {
    this.handleArrayPatternElement?.(m)
    return super.visitArrayPatternElement(m)
  }
}

export function isAccessibility(n: unknown): n is Accessibility {
  return typeof n === 'string' && ['public', 'protected', 'private'].includes(n)
}
export function isArgument(n: unknown): n is Argument {
  return typeof n === 'object' && n !== null && 'expression' in n && isExpression(n.expression)
}
export function isArrayExpression(n: unknown): n is ArrayExpression {
  return isNode(n) && isHasSpan(n) && n.type === 'ArrayExpression'
}
export function isArrayPattern(n: unknown): n is ArrayPattern {
  return isNode(n) && isHasSpan(n) && n.type === 'ArrayPattern'
}
export function isArrowFunctionExpression(n: unknown): n is ArrowFunctionExpression {
  return isNode(n) && isHasSpan(n) && n.type === 'ArrowFunctionExpression'
}
export function isAssignmentExpression(n: unknown): n is AssignmentExpression {
  return isNode(n) && isHasSpan(n) && n.type === 'AssignmentExpression'
}
export function isAssignmentPattern(n: unknown): n is AssignmentPattern {
  return isNode(n) && isHasSpan(n) && n.type === 'AssignmentPattern'
}
export function isAssignmentPatternProperty(n: unknown): n is AssignmentPatternProperty {
  return isNode(n) && isHasSpan(n) && n.type === 'AssignmentPatternProperty'
}
export function isAssignmentProperty(n: unknown): n is AssignmentProperty {
  return isNode(n) && isHasSpan(n) && n.type === 'AssignmentProperty'
}
export function isAwaitExpression(n: unknown): n is AwaitExpression {
  return isNode(n) && isHasSpan(n) && n.type === 'AwaitExpression'
}
export function isBigIntLiteral(n: unknown): n is BigIntLiteral {
  return isNode(n) && isHasSpan(n) && n.type === 'BigIntLiteral'
}
export function isBinaryExpression(n: unknown): n is BinaryExpression {
  return isNode(n) && isHasSpan(n) && n.type === 'BinaryExpression'
}
export function isBindingIdentifier(n: unknown): n is BindingIdentifier {
  return isNode(n) && isHasSpan(n) && n.type === 'Identifier'
}
export function isBlockStatement(n: unknown): n is BlockStatement {
  return isNode(n) && isHasSpan(n) && n.type === 'BlockStatement'
}
export function isBooleanLiteral(n: unknown): n is BooleanLiteral {
  return isNode(n) && isHasSpan(n) && n.type === 'BooleanLiteral'
}
export function isBreakStatement(n: unknown): n is BreakStatement {
  return isNode(n) && isHasSpan(n) && n.type === 'BreakStatement'
}
export function isCallExpression(n: unknown): n is CallExpression {
  return isNode(n) && isHasSpan(n) && n.type === 'CallExpression'
}
export function isCatchClause(n: unknown): n is CatchClause {
  return isNode(n) && isHasSpan(n) && n.type === 'CatchClause'
}
export function isClass(n: unknown): n is Class {
  return isNode(n) && isHasSpan(n) && n.type === 'Class'
}
export function isClassDeclaration(n: unknown): n is ClassDeclaration {
  return isNode(n) && isHasSpan(n) && n.type === 'ClassDeclaration'
}
export function isClassExpression(n: unknown): n is ClassExpression {
  return isNode(n) && isHasSpan(n) && n.type === 'ClassExpression'
}

export function isClassMember(n: unknown): n is ClassMember {
  return isConstructor(n) || isClassMethod(n) || isPrivateMethod(n) || isClassProperty(n) || isPrivateProperty(n) || isTsIndexSignature(n) || isEmptyStatement(n) || isStaticBlock(n)
}
export function isClassMethod(n: unknown): n is ClassMethod {
  return isNode(n) && isHasSpan(n) && n.type === 'ClassMethod'
}
export function isClassProperty(n: unknown): n is ClassProperty {
  return isNode(n) && isHasSpan(n) && n.type === 'ClassProperty'
}
export function isComputedPropName(n: unknown): n is ComputedPropName {
  return isNode(n) && isHasSpan(n) && n.type === 'ComputedPropName'
}
export function isConditionalExpression(n: unknown): n is ConditionalExpression {
  return isNode(n) && isHasSpan(n) && n.type === 'ConditionalExpression'
}
export function isConstructor(n: unknown): n is Constructor {
  return isNode(n) && isHasSpan(n) && n.type === 'Constructor'
}
export function isContinueStatement(n: unknown): n is ContinueStatement {
  return isNode(n) && isHasSpan(n) && n.type === 'ContinueStatement'
}
export function isDebuggerStatement(n: unknown): n is DebuggerStatement {
  return isNode(n) && isHasSpan(n) && n.type === 'DebuggerStatement'
}
export function isDeclaration(n: unknown): n is Declaration {
  return (
    isClassDeclaration(n) || isFunctionDeclaration(n) || isVariableDeclaration(n) || isTsInterfaceDeclaration(n) || isTsTypeAliasDeclaration(n) || isTsEnumDeclaration(n) || isTsModuleDeclaration(n)
  )
}
export function isDecorator(n: unknown): n is Decorator {
  return isNode(n) && isHasSpan(n) && n.type === 'Decorator'
}
export function isDefaultDecl(n: unknown): n is DefaultDecl {
  return isClassExpression(n) || isFunctionExpression(n) || isTsInterfaceDeclaration(n)
}
export function isDoWhileStatement(n: unknown): n is DoWhileStatement {
  return isNode(n) && isHasSpan(n) && n.type === 'DoWhileStatement'
}
export function isEmptyStatement(n: unknown): n is EmptyStatement {
  return isNode(n) && isHasSpan(n) && n.type === 'EmptyStatement'
}
export function isExportAllDeclaration(n: unknown): n is ExportAllDeclaration {
  return isNode(n) && isHasSpan(n) && n.type === 'ExportAllDeclaration'
}
export function isExportDeclaration(n: unknown): n is ExportDeclaration {
  return isNode(n) && isHasSpan(n) && n.type === 'ExportDeclaration'
}
export function isExportDefaultDeclaration(n: unknown): n is ExportDefaultDeclaration {
  return isNode(n) && isHasSpan(n) && n.type === 'ExportDefaultDeclaration'
}
export function isExportDefaultExpression(n: unknown): n is ExportDefaultExpression {
  return isNode(n) && isHasSpan(n) && n.type === 'ExportDefaultExpression'
}
export function isExportDefaultSpecifier(n: unknown): n is ExportDefaultSpecifier {
  return isNode(n) && isHasSpan(n) && n.type === 'ExportDefaultSpecifier'
}
export function isExportNamedDeclaration(n: unknown): n is ExportNamedDeclaration {
  return isNode(n) && isHasSpan(n) && n.type === 'ExportNamedDeclaration'
}
export function isExportNamespaceSpecifier(n: unknown): n is ExportNamespaceSpecifier {
  return isNode(n) && isHasSpan(n) && n.type === 'ExportNamespaceSpecifier'
}
export function isExportSpecifier(n: unknown): n is ExportSpecifier {
  return isExportNamespaceSpecifier(n) || isExportDefaultSpecifier(n) || isNamedExportSpecifier(n)
}
export function isExprOrSpread(n: unknown): n is ExprOrSpread {
  return typeof n === 'object' && n !== null && 'expression' in n && isExpression(n.expression)
}

export function isExpression(n: unknown): n is Expression {
  return (
    isThisExpression(n) ||
    isArrayExpression(n) ||
    isObjectExpression(n) ||
    isFunctionExpression(n) ||
    isUnaryExpression(n) ||
    isUpdateExpression(n) ||
    isBinaryExpression(n) ||
    isAssignmentExpression(n) ||
    isMemberExpression(n) ||
    isSuperPropExpression(n) ||
    isConditionalExpression(n) ||
    isCallExpression(n) ||
    isNewExpression(n) ||
    isSequenceExpression(n) ||
    isIdentifier(n) ||
    isLiteral(n) ||
    isTemplateLiteral(n) ||
    isTaggedTemplateExpression(n) ||
    isArrowFunctionExpression(n) ||
    isClassExpression(n) ||
    isYieldExpression(n) ||
    isMetaProperty(n) ||
    isAwaitExpression(n) ||
    isParenthesisExpression(n) ||
    isJSXMemberExpression(n) ||
    isJSXNamespacedName(n) ||
    isJSXEmptyExpression(n) ||
    isJSXElement(n) ||
    isJSXFragment(n) ||
    isTsTypeAssertion(n) ||
    isTsConstAssertion(n) ||
    isTsNonNullExpression(n) ||
    isTsAsExpression(n) ||
    isTsInstantiation(n) ||
    isPrivateName(n) ||
    isOptionalChainingExpression(n) ||
    isInvalid(n)
  )
}
export function isExpressionStatement(n: unknown): n is ExpressionStatement {
  return isNode(n) && isHasSpan(n) && n.type === 'ExpressionStatement'
}

export function isForInStatement(n: unknown): n is ForInStatement {
  return isNode(n) && isHasSpan(n) && n.type === 'ForInStatement'
}
export function isForOfStatement(n: unknown): n is ForOfStatement {
  return isNode(n) && isHasSpan(n) && n.type === 'ForOfStatement'
}
export function isForStatement(n: unknown): n is ForStatement {
  return isNode(n) && isHasSpan(n) && n.type === 'ForStatement'
}
export function isFunctionDeclaration(n: unknown): n is FunctionDeclaration {
  return isNode(n) && isHasSpan(n) && n.type === 'FunctionDeclaration'
}
export function isFunctionExpression(n: unknown): n is FunctionExpression {
  return isNode(n) && isHasSpan(n) && n.type === 'FunctionExpression'
}
export function isGetterProperty(n: unknown): n is GetterProperty {
  return isNode(n) && isHasSpan(n) && n.type === 'GetterProperty'
}
export function isIdentifier(n: unknown): n is Identifier {
  return isNode(n) && isHasSpan(n) && n.type === 'Identifier'
}
export function isIfStatement(n: unknown): n is IfStatement {
  return isNode(n) && isHasSpan(n) && n.type === 'IfStatement'
}
export function isImport(n: unknown): n is Import {
  return isNode(n) && isHasSpan(n) && n.type === 'Import'
}
export function isImportDeclaration(n: unknown): n is ImportDeclaration {
  return isNode(n) && isHasSpan(n) && n.type === 'ImportDeclaration'
}
export function isImportDefaultSpecifier(n: unknown): n is ImportDefaultSpecifier {
  return isNode(n) && isHasSpan(n) && n.type === 'ImportDefaultSpecifier'
}
export function isImportNamespaceSpecifier(n: unknown): n is ImportNamespaceSpecifier {
  return isNode(n) && isHasSpan(n) && n.type === 'ImportNamespaceSpecifier'
}

export function isImportSpecifier(n: unknown): n is ImportSpecifier {
  return isNamedExportSpecifier(n) || isImportDefaultSpecifier(n) || isImportNamespaceSpecifier(n)
}

export function isLiteral(n: unknown): n is Literal {
  return isStringLiteral(n) || isBooleanLiteral(n) || isNullLiteral(n) || isNumericLiteral(n) || isBigIntLiteral(n) || isRegExpLiteral(n) || isJSXText(n)
}

export function isJSXAttrValue(n: unknown): n is JSXAttrValue {
  return isLiteral(n) || isJSXExpressionContainer(n) || isJSXElement(n) || isJSXFragment(n)
}
export function isJSXAttribute(n: unknown): n is JSXAttribute {
  return isNode(n) && isHasSpan(n) && n.type === 'JSXAttribute'
}

export function isJSXAttributeName(n: unknown): n is JSXAttributeName {
  return isIdentifier(n) || isJSXNamespacedName(n)
}

export function isJSXAttributeOrSpread(n: unknown): n is JSXAttributeOrSpread {
  return isJSXAttribute(n) || isSpreadElement(n)
}
export function isJSXClosingElement(n: unknown): n is JSXClosingElement {
  return isNode(n) && isHasSpan(n) && n.type === 'JSXClosingElement'
}
export function isJSXClosingFragment(n: unknown): n is JSXClosingFragment {
  return isNode(n) && isHasSpan(n) && n.type === 'JSXClosingFragment'
}
export function isJSXElement(n: unknown): n is JSXElement {
  return isNode(n) && isHasSpan(n) && n.type === 'JSXElement'
}

export function isJSXElementChild(n: unknown): n is JSXElementChild {
  return isJSXText(n) || isJSXExpressionContainer(n) || isJSXSpreadChild(n) || isJSXElement(n) || isJSXFragment(n)
}

export function isJSXElementName(n: unknown): n is JSXElementName {
  return isIdentifier(n) || isJSXMemberExpression(n) || isJSXNamespacedName(n)
}
export function isJSXEmptyExpression(n: unknown): n is JSXEmptyExpression {
  return isNode(n) && isHasSpan(n) && n.type === 'JSXEmptyExpression'
}
export function isJSXExpressionContainer(n: unknown): n is JSXExpressionContainer {
  return isNode(n) && isHasSpan(n) && n.type === 'JSXExpressionContainer'
}
export function isJSXFragment(n: unknown): n is JSXFragment {
  return isNode(n) && isHasSpan(n) && n.type === 'JSXFragment'
}
export function isJSXMemberExpression(n: unknown): n is JSXMemberExpression {
  return isNode(n) && isHasSpan(n) && n.type === 'JSXMemberExpression'
}
export function isJSXNamespacedName(n: unknown): n is JSXNamespacedName {
  return isNode(n) && isHasSpan(n) && n.type === 'JSXNamespacedName'
}
export function isJSXObject(n: unknown): n is JSXObject {
  return isNode(n) && isHasSpan(n) && n.type === 'JSXObject'
}
export function isJSXOpeningElement(n: unknown): n is JSXOpeningElement {
  return isNode(n) && isHasSpan(n) && n.type === 'JSXOpeningElement'
}
export function isJSXOpeningFragment(n: unknown): n is JSXOpeningFragment {
  return isNode(n) && isHasSpan(n) && n.type === 'JSXOpeningFragment'
}
export function isJSXSpreadChild(n: unknown): n is JSXSpreadChild {
  return isNode(n) && isHasSpan(n) && n.type === 'JSXSpreadChild'
}
export function isJSXText(n: unknown): n is JSXText {
  return isNode(n) && isHasSpan(n) && n.type === 'JSXText'
}
export function isKeyValuePatternProperty(n: unknown): n is KeyValuePatternProperty {
  return isNode(n) && isHasSpan(n) && n.type === 'KeyValuePatternProperty'
}
export function isKeyValueProperty(n: unknown): n is KeyValueProperty {
  return isNode(n) && isHasSpan(n) && n.type === 'KeyValueProperty'
}
export function isLabeledStatement(n: unknown): n is LabeledStatement {
  return isNode(n) && isHasSpan(n) && n.type === 'LabeledStatement'
}
export function isMemberExpression(n: unknown): n is MemberExpression {
  return isNode(n) && isHasSpan(n) && n.type === 'MemberExpression'
}
export function isMetaProperty(n: unknown): n is MetaProperty {
  return isNode(n) && isHasSpan(n) && n.type === 'MetaProperty'
}
export function isMethodProperty(n: unknown): n is MethodProperty {
  return isNode(n) && isHasSpan(n) && n.type === 'MethodProperty'
}
export function isModule(n: unknown): n is Module {
  return isNode(n) && isHasSpan(n) && n.type === 'Module'
}

export function isModuleDeclaration(n: unknown): n is ModuleDeclaration {
  return (
    isImportDeclaration(n) ||
    isExportDeclaration(n) ||
    isExportNamedDeclaration(n) ||
    isExportDefaultDeclaration(n) ||
    isExportDefaultExpression(n) ||
    isExportAllDeclaration(n) ||
    isTsImportEqualsDeclaration(n) ||
    isTsExportAssignment(n) ||
    isTsNamespaceExportDeclaration(n)
  )
}
export function isModuleExportName(n: unknown): n is ModuleExportName {
  return isIdentifier(n) || isStringLiteral(n)
}

export function isModuleItem(n: unknown): n is ModuleItem {
  return isModuleDeclaration(n) || isStatement(n)
}
export function isNamedExportSpecifier(n: unknown): n is NamedExportSpecifier {
  return isNode(n) && isHasSpan(n) && n.type === 'NamedExportSpecifier'
}
export function isNamedImportSpecifier(n: unknown): n is NamedImportSpecifier {
  return isNode(n) && isHasSpan(n) && n.type === 'NamedImportSpecifier'
}
export function isNewExpression(n: unknown): n is NewExpression {
  return isNode(n) && isHasSpan(n) && n.type === 'NewExpression'
}
export function isNullLiteral(n: unknown): n is NullLiteral {
  return isNode(n) && isHasSpan(n) && n.type === 'NullLiteral'
}
export function isNumericLiteral(n: unknown): n is NumericLiteral {
  return isNode(n) && isHasSpan(n) && n.type === 'NumericLiteral'
}
export function isObjectExpression(n: unknown): n is ObjectExpression {
  return isNode(n) && isHasSpan(n) && n.type === 'ObjectExpression'
}
export function isObjectPattern(n: unknown): n is ObjectPattern {
  return isNode(n) && isHasSpan(n) && n.type === 'ObjectPattern'
}
export function isObjectPatternProperty(n: unknown): n is ObjectPatternProperty {
  return isKeyValuePatternProperty(n) || isAssignmentPatternProperty(n) || isRestElement(n)
}
export function isOptionalChainingCall(n: unknown): n is OptionalChainingCall {
  return isNode(n) && isHasSpan(n) && n.type === 'CallExpression'
}

export function isOptionalChainingExpression(n: unknown): n is OptionalChainingExpression {
  return isNode(n) && isHasSpan(n) && n.type === 'OptionalChainingExpression'
}

export function isParam(n: unknown): n is Param {
  return isNode(n) && isHasSpan(n) && n.type === 'Param'
}
export function isParenthesisExpression(n: unknown): n is ParenthesisExpression {
  return isNode(n) && isHasSpan(n) && n.type === 'ParenthesisExpression'
}

export function isInvalid(n: unknown): n is Invalid {
  return isNode(n) && isHasSpan(n) && n.type === 'Invalid'
}
export function isPattern(n: unknown): n is Pattern {
  return isBindingIdentifier(n) || isArrayPattern(n) || isRestElement(n) || isObjectPattern(n) || isAssignmentPattern(n) || isInvalid(n) || isExpression(n)
}
export function isPrivateMethod(n: unknown): n is PrivateMethod {
  return isNode(n) && isHasSpan(n) && n.type === 'PrivateMethod'
}
export function isPrivateName(n: unknown): n is PrivateName {
  return isNode(n) && isHasSpan(n) && n.type === 'PrivateName'
}

export function isPrivateProperty(n: unknown): n is PrivateProperty {
  return isNode(n) && isHasSpan(n) && n.type === 'PrivateProperty'
}

export function isProgram(n: unknown): n is Program {
  return isModule(n) || isScript(n)
}

export function isProperty(n: unknown): n is Property {
  return isIdentifier(n) || isKeyValueProperty(n) || isAssignmentProperty(n) || isGetterProperty(n) || isSetterProperty(n) || isMethodProperty(n)
}
export function isPropertyName(n: unknown): n is PropertyName {
  return isIdentifier(n) || isStringLiteral(n) || isNumericLiteral(n) || isComputedPropName(n) || isBigIntLiteral(n)
}
export function isRegExpLiteral(n: unknown): n is RegExpLiteral {
  return isNode(n) && isHasSpan(n) && n.type === 'RegExpLiteral'
}
export function isRestElement(n: unknown): n is RestElement {
  return isNode(n) && isHasSpan(n) && n.type === 'RestElement'
}
export function isReturnStatement(n: unknown): n is ReturnStatement {
  return isNode(n) && isHasSpan(n) && n.type === 'ReturnStatement'
}
export function isScript(n: unknown): n is Script {
  return isNode(n) && isHasSpan(n) && 'interpreter' in n && n.type === 'Script'
}
export function isSequenceExpression(n: unknown): n is SequenceExpression {
  return isNode(n) && isHasSpan(n) && n.type === 'SequenceExpression'
}
export function isSetterProperty(n: unknown): n is SetterProperty {
  return isNode(n) && isHasSpan(n) && n.type === 'SetterProperty'
}
export function isSpreadElement(n: unknown): n is SpreadElement {
  return isNode(n) && isHasSpan(n) && n.type === 'SpreadElement'
}

export function isStatement(n: unknown): n is Statement {
  return (
    isBlockStatement(n) ||
    isEmptyStatement(n) ||
    isDebuggerStatement(n) ||
    isWithStatement(n) ||
    isReturnStatement(n) ||
    isLabeledStatement(n) ||
    isBreakStatement(n) ||
    isContinueStatement(n) ||
    isIfStatement(n) ||
    isSwitchStatement(n) ||
    isThrowStatement(n) ||
    isTryStatement(n) ||
    isWhileStatement(n) ||
    isDoWhileStatement(n) ||
    isForStatement(n) ||
    isForInStatement(n) ||
    isForOfStatement(n) ||
    isDeclaration(n) ||
    isExpressionStatement(n)
  )
}
export function isStaticBlock(n: unknown): n is StaticBlock {
  return isNode(n) && isHasSpan(n) && n.type === 'StaticBlock'
}
export function isStringLiteral(n: unknown): n is StringLiteral {
  return isNode(n) && isHasSpan(n) && n.type === 'StringLiteral'
}
export function isSuper(n: unknown): n is Super {
  return isNode(n) && isHasSpan(n) && n.type === 'Super'
}
export function isSuperPropExpression(n: unknown): n is SuperPropExpression {
  return isNode(n) && isHasSpan(n) && n.type === 'SuperPropExpression'
}
export function isSwitchCase(n: unknown): n is SwitchCase {
  return isNode(n) && isHasSpan(n) && n.type === 'SwitchCase'
}
export function isSwitchStatement(n: unknown): n is SwitchStatement {
  return isNode(n) && isHasSpan(n) && n.type === 'SwitchStatement'
}
export function isTaggedTemplateExpression(n: unknown): n is TaggedTemplateExpression {
  return isNode(n) && isHasSpan(n) && n.type === 'TaggedTemplateExpression'
}
export function isTemplateLiteral(n: unknown): n is TemplateLiteral {
  return isNode(n) && isHasSpan(n) && n.type === 'TemplateLiteral'
}
export function isThisExpression(n: unknown): n is ThisExpression {
  return isNode(n) && isHasSpan(n) && n.type === 'ThisExpression'
}
export function isThrowStatement(n: unknown): n is ThrowStatement {
  return isNode(n) && isHasSpan(n) && n.type === 'ThrowStatement'
}
export function isTryStatement(n: unknown): n is TryStatement {
  return isNode(n) && isHasSpan(n) && n.type === 'TryStatement'
}
export function isTsAsExpression(n: unknown): n is TsAsExpression {
  return isNode(n) && isHasSpan(n) && n.type === 'TsAsExpression'
}
export function isTsCallSignatureDeclaration(n: unknown): n is TsCallSignatureDeclaration {
  return isNode(n) && isHasSpan(n) && n.type === 'TsCallSignatureDeclaration'
}
export function isTsConstAssertion(n: unknown): n is TsConstAssertion {
  return isNode(n) && isHasSpan(n) && n.type === 'TsConstAssertion'
}
export function isTsConstructSignatureDeclaration(n: unknown): n is TsConstructSignatureDeclaration {
  return isNode(n) && isHasSpan(n) && n.type === 'TsConstructSignatureDeclaration'
}

export function isTsEnumDeclaration(n: unknown): n is TsEnumDeclaration {
  return isNode(n) && isHasSpan(n) && n.type === 'TsEnumDeclaration'
}
export function isTsEnumMember(n: unknown): n is TsEnumMember {
  return isNode(n) && isHasSpan(n) && n.type === 'TsEnumMember'
}

export function isTsEnumMemberId(n: unknown): n is TsEnumMemberId {
  return isIdentifier(n) || isStringLiteral(n)
}
export function isTsExportAssignment(n: unknown): n is TsExportAssignment {
  return isNode(n) && isHasSpan(n) && n.type === 'TsExportAssignment'
}
export function isTsExpressionWithTypeArguments(n: unknown): n is TsExpressionWithTypeArguments {
  return isNode(n) && isHasSpan(n) && n.type === 'TsExpressionWithTypeArguments'
}
export function isTsExternalModuleReference(n: unknown): n is TsExternalModuleReference {
  return isNode(n) && isHasSpan(n) && n.type === 'TsExternalModuleReference'
}

export function isObjectPatter(n: unknown): n is ObjectPattern {
  return isNode(n) && isHasSpan(n) && n.type === 'ObjectPattern'
}

export function isTsFnParameter(n: unknown): n is TsFnParameter {
  return isBindingIdentifier(n) || isArrayPattern(n) || isRestElement(n) || isObjectPatter(n)
}
export function isTsGetterSignature(n: unknown): n is TsGetterSignature {
  return isNode(n) && isHasSpan(n) && n.type === 'TsGetterSignature'
}
export function isTsImportEqualsDeclaration(n: unknown): n is TsImportEqualsDeclaration {
  return isNode(n) && isHasSpan(n) && n.type === 'TsImportEqualsDeclaration'
}
export function isTsIndexSignature(n: unknown): n is TsIndexSignature {
  return isNode(n) && isHasSpan(n) && n.type === 'TsIndexSignature'
}
export function isTsInstantiation(n: unknown): n is TsInstantiation {
  return isNode(n) && isHasSpan(n) && n.type === 'TsInstantiation'
}
export function isTsInterfaceBody(n: unknown): n is TsInterfaceBody {
  return isNode(n) && isHasSpan(n) && n.type === 'TsInterfaceBody'
}
export function isTsInterfaceDeclaration(n: unknown): n is TsInterfaceDeclaration {
  return isNode(n) && isHasSpan(n) && n.type === 'TsInterfaceDeclaration'
}
export function isTsMethodSignature(n: unknown): n is TsMethodSignature {
  return isNode(n) && isHasSpan(n) && n.type === 'TsMethodSignature'
}
export function isTsModuleBlock(n: unknown): n is TsModuleBlock {
  return isNode(n) && isHasSpan(n) && n.type === 'TsModuleBlock'
}
export function isTsModuleDeclaration(n: unknown): n is TsModuleDeclaration {
  return isNode(n) && isHasSpan(n) && n.type === 'TsModuleDeclaration'
}

export function isTsModuleName(n: unknown): n is TsModuleName {
  return isIdentifier(n) || isStringLiteral(n)
}

export function isTsEntityName(n: unknown): n is TsEntityName {
  return isTsQualifiedName(n) || isIdentifier(n)
}

export function isTsModuleReference(n: unknown): n is TsModuleReference {
  return isTsEntityName(n) || isTsExternalModuleReference(n)
}

export function isTsNamespaceBody(n: unknown): n is TsNamespaceBody {
  return isTsModuleBlock(n) || isTsNamespaceDeclaration(n)
}
export function isTsNamespaceDeclaration(n: unknown): n is TsNamespaceDeclaration {
  return isNode(n) && isHasSpan(n) && n.type === 'TsNamespaceDeclaration'
}
export function isTsNamespaceExportDeclaration(n: unknown): n is TsNamespaceExportDeclaration {
  return isNode(n) && isHasSpan(n) && n.type === 'TsNamespaceExportDeclaration'
}
export function isTsNonNullExpression(n: unknown): n is TsNonNullExpression {
  return isNode(n) && isHasSpan(n) && n.type === 'TsNonNullExpression'
}
export function isTsParameterProperty(n: unknown): n is TsParameterProperty {
  return isNode(n) && isHasSpan(n) && n.type === 'TsParameterProperty'
}

export function isTsParameterPropertyParameter(n: unknown): n is TsParameterPropertyParameter {
  return isBindingIdentifier(n) || isAssignmentPattern(n)
}
export function isTsPropertySignature(n: unknown): n is TsPropertySignature {
  return isNode(n) && isHasSpan(n) && n.type === 'TsPropertySignature'
}
export function isTsQualifiedName(n: unknown): n is TsQualifiedName {
  return isNode(n) && isHasSpan(n) && n.type === 'TsQualifiedName'
}
export function isTsSetterSignature(n: unknown): n is TsSetterSignature {
  return isNode(n) && isHasSpan(n) && n.type === 'TsSetterSignature'
}

export function isTsKeywordType(n: unknown): n is TsKeywordType {
  return isNode(n) && isHasSpan(n) && n.type === 'TsKeywordType'
}
export function isTsThisType(n: unknown): n is TsThisType {
  return isNode(n) && isHasSpan(n) && n.type === 'TsThisType'
}

export function isTsFunctionType(n: unknown): n is TsFunctionType {
  return isNode(n) && isHasSpan(n) && n.type === 'TsFunctionType'
}
export function isTsConstructorType(n: unknown): n is TsConstructorType {
  return isNode(n) && isHasSpan(n) && n.type === 'TsConstructorType'
}

export function isTsFnOrConstructorType(n: unknown): n is TsFnOrConstructorType {
  return isTsFunctionType(n) || isTsConstructorType(n)
}
export function isTsTypeReference(n: unknown): n is TsTypeReference {
  return isNode(n) && isHasSpan(n) && n.type === 'TsTypeReference'
}
export function isTsTypeQuery(n: unknown): n is TsTypeQuery {
  return isNode(n) && isHasSpan(n) && n.type === 'TsTypeQuery'
}
export function isTsTypeLiteral(n: unknown): n is TsTypeLiteral {
  return isNode(n) && isHasSpan(n) && n.type === 'TsTypeLiteral'
}
export function isTsArrayType(n: unknown): n is TsArrayType {
  return isNode(n) && isHasSpan(n) && n.type === 'TsArrayType'
}
export function isTsTupleType(n: unknown): n is TsTupleType {
  return isNode(n) && isHasSpan(n) && n.type === 'TsTupleType'
}
export function isTsOptionalType(n: unknown): n is TsOptionalType {
  return isNode(n) && isHasSpan(n) && n.type === 'TsOptionalType'
}
export function isTsRestType(n: unknown): n is TsRestType {
  return isNode(n) && isHasSpan(n) && n.type === 'TsRestType'
}

export function isTsUnionType(n: unknown): n is TsUnionType {
  return isNode(n) && isHasSpan(n) && n.type === 'TsUnionType'
}
export function isTsIntersectionType(n: unknown): n is TsIntersectionType {
  return isNode(n) && isHasSpan(n) && n.type === 'TsIntersectionType'
}

export function isTsUnionOrIntersectionType(n: unknown): n is TsUnionOrIntersectionType {
  return isTsUnionType(n) || isTsIntersectionType(n)
}
export function isTsConditionalType(n: unknown): n is TsConditionalType {
  return isNode(n) && isHasSpan(n) && n.type === 'TsConditionalType'
}
export function isTsInferType(n: unknown): n is TsInferType {
  return isNode(n) && isHasSpan(n) && n.type === 'TsInferType'
}
export function isTsParenthesizedType(n: unknown): n is TsParenthesizedType {
  return isNode(n) && isHasSpan(n) && n.type === 'TsParenthesizedType'
}
export function isTsTypeOperator(n: unknown): n is TsTypeOperator {
  return isNode(n) && isHasSpan(n) && n.type === 'TsTypeOperator'
}
export function isTsIndexedAccessType(n: unknown): n is TsIndexedAccessType {
  return isNode(n) && isHasSpan(n) && n.type === 'TsIndexedAccessType'
}
export function isTsMappedType(n: unknown): n is TsMappedType {
  return isNode(n) && isHasSpan(n) && n.type === 'TsMappedType'
}
export function isTsLiteralType(n: unknown): n is TsLiteralType {
  return isNode(n) && isHasSpan(n) && n.type === 'TsLiteralType'
}
export function isTsTypePredicate(n: unknown): n is TsTypePredicate {
  return isNode(n) && isHasSpan(n) && n.type === 'TsTypePredicate'
}
export function isTsImportType(n: unknown): n is TsImportType {
  return isNode(n) && isHasSpan(n) && n.type === 'TsImportType'
}

export function isTsType(n: unknown): n is TsType {
  return (
    isTsKeywordType(n) ||
    isTsThisType(n) ||
    isTsFnOrConstructorType(n) ||
    isTsTypeReference(n) ||
    isTsTypeQuery(n) ||
    isTsTypeLiteral(n) ||
    isTsArrayType(n) ||
    isTsTupleType(n) ||
    isTsOptionalType(n) ||
    isTsRestType(n) ||
    isTsUnionOrIntersectionType(n) ||
    isTsConditionalType(n) ||
    isTsInferType(n) ||
    isTsParenthesizedType(n) ||
    isTsTypeOperator(n) ||
    isTsIndexedAccessType(n) ||
    isTsMappedType(n) ||
    isTsLiteralType(n) ||
    isTsTypePredicate(n) ||
    isTsImportType(n)
  )
}
export function isTsTypeAliasDeclaration(n: unknown): n is TsTypeAliasDeclaration {
  return isNode(n) && isHasSpan(n) && n.type === 'TsTypeAliasDeclaration'
}
export function isTsTypeAnnotation(n: unknown): n is TsTypeAnnotation {
  return isNode(n) && isHasSpan(n) && n.type === 'TsTypeAnnotation'
}
export function isTsTypeAssertion(n: unknown): n is TsTypeAssertion {
  return isNode(n) && isHasSpan(n) && n.type === 'TsTypeAssertion'
}

export function isTsTypeElement(n: unknown): n is TsTypeElement {
  return (
    isTsCallSignatureDeclaration(n) ||
    isTsConstructSignatureDeclaration(n) ||
    isTsPropertySignature(n) ||
    isTsGetterSignature(n) ||
    isTsSetterSignature(n) ||
    isTsMethodSignature(n) ||
    isTsIndexSignature(n)
  )
}
export function isTsTypeParameter(n: unknown): n is TsTypeParameter {
  return isNode(n) && isHasSpan(n) && n.type === 'TsTypeParameter'
}
export function isTsTypeParameterDeclaration(n: unknown): n is TsTypeParameterDeclaration {
  return isNode(n) && isHasSpan(n) && n.type === 'TsTypeParameterDeclaration'
}
export function isTsTypeParameterInstantiation(n: unknown): n is TsTypeParameterInstantiation {
  return isNode(n) && isHasSpan(n) && n.type === 'TsTypeParameterInstantiation'
}
export function isUnaryExpression(n: unknown): n is UnaryExpression {
  return isNode(n) && isHasSpan(n) && n.type === 'UnaryExpression'
}
export function isUpdateExpression(n: unknown): n is UpdateExpression {
  return isNode(n) && isHasSpan(n) && n.type === 'UpdateExpression'
}
export function isVariableDeclaration(n: unknown): n is VariableDeclaration {
  return isNode(n) && isHasSpan(n) && n.type === 'VariableDeclaration'
}
export function isVariableDeclarator(n: unknown): n is VariableDeclarator {
  return isNode(n) && isHasSpan(n) && n.type === 'VariableDeclarator'
}
export function isWhileStatement(n: unknown): n is WhileStatement {
  return isNode(n) && isHasSpan(n) && n.type === 'WhileStatement'
}
export function isWithStatement(n: unknown): n is WithStatement {
  return isNode(n) && isHasSpan(n) && n.type === 'WithStatement'
}
export function isYieldExpression(n: unknown): n is YieldExpression {
  return isNode(n) && isHasSpan(n) && n.type === 'YieldExpression'
}
