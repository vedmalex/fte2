"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isForOfStatement = exports.isForInStatement = exports.isExpressionStatement = exports.isExpression = exports.isExprOrSpread = exports.isExportSpecifier = exports.isExportNamespaceSpecifier = exports.isExportNamedDeclaration = exports.isExportDefaultSpecifier = exports.isExportDefaultExpression = exports.isExportDefaultDeclaration = exports.isExportDeclaration = exports.isExportAllDeclaration = exports.isEmptyStatement = exports.isDoWhileStatement = exports.isDefaultDecl = exports.isDecorator = exports.isDeclaration = exports.isDebuggerStatement = exports.isContinueStatement = exports.isConstructor = exports.isConditionalExpression = exports.isComputedPropName = exports.isClassProperty = exports.isClassMethod = exports.isClassMember = exports.isClassExpression = exports.isClassDeclaration = exports.isClass = exports.isCatchClause = exports.isCallExpression = exports.isBreakStatement = exports.isBooleanLiteral = exports.isBlockStatement = exports.isBindingIdentifier = exports.isBinaryExpression = exports.isBigIntLiteral = exports.isAwaitExpression = exports.isAssignmentProperty = exports.isAssignmentPatternProperty = exports.isAssignmentPattern = exports.isAssignmentExpression = exports.isArrowFunctionExpression = exports.isArrayPattern = exports.isArrayExpression = exports.isArgument = exports.isAccessibility = exports.BaseVistor = exports.isHasSpan = exports.isNode = void 0;
exports.isOptionalChainingCall = exports.isObjectPatternProperty = exports.isObjectPattern = exports.isObjectExpression = exports.isNumericLiteral = exports.isNullLiteral = exports.isNewExpression = exports.isNamedImportSpecifier = exports.isNamedExportSpecifier = exports.isModuleItem = exports.isModuleExportName = exports.isModuleDeclaration = exports.isModule = exports.isMethodProperty = exports.isMetaProperty = exports.isMemberExpression = exports.isLabeledStatement = exports.isKeyValueProperty = exports.isKeyValuePatternProperty = exports.isJSXText = exports.isJSXSpreadChild = exports.isJSXOpeningFragment = exports.isJSXOpeningElement = exports.isJSXObject = exports.isJSXNamespacedName = exports.isJSXMemberExpression = exports.isJSXFragment = exports.isJSXExpressionContainer = exports.isJSXEmptyExpression = exports.isJSXElementName = exports.isJSXElementChild = exports.isJSXElement = exports.isJSXClosingFragment = exports.isJSXClosingElement = exports.isJSXAttributeOrSpread = exports.isJSXAttributeName = exports.isJSXAttribute = exports.isJSXAttrValue = exports.isLiteral = exports.isImportSpecifier = exports.isImportNamespaceSpecifier = exports.isImportDefaultSpecifier = exports.isImportDeclaration = exports.isImport = exports.isIfStatement = exports.isIdentifier = exports.isGetterProperty = exports.isFunctionExpression = exports.isFunctionDeclaration = exports.isForStatement = void 0;
exports.isTsModuleBlock = exports.isTsMethodSignature = exports.isTsInterfaceDeclaration = exports.isTsInterfaceBody = exports.isTsInstantiation = exports.isTsIndexSignature = exports.isTsImportEqualsDeclaration = exports.isTsGetterSignature = exports.isTsFnParameter = exports.isObjectPatter = exports.isTsExternalModuleReference = exports.isTsExpressionWithTypeArguments = exports.isTsExportAssignment = exports.isTsEnumMemberId = exports.isTsEnumMember = exports.isTsEnumDeclaration = exports.isTsConstructSignatureDeclaration = exports.isTsConstAssertion = exports.isTsCallSignatureDeclaration = exports.isTsAsExpression = exports.isTryStatement = exports.isThrowStatement = exports.isThisExpression = exports.isTemplateLiteral = exports.isTaggedTemplateExpression = exports.isSwitchStatement = exports.isSwitchCase = exports.isSuperPropExpression = exports.isSuper = exports.isStringLiteral = exports.isStaticBlock = exports.isStatement = exports.isSpreadElement = exports.isSetterProperty = exports.isSequenceExpression = exports.isScript = exports.isReturnStatement = exports.isRestElement = exports.isRegExpLiteral = exports.isPropertyName = exports.isProperty = exports.isProgram = exports.isPrivateProperty = exports.isPrivateName = exports.isPrivateMethod = exports.isPattern = exports.isInvalid = exports.isParenthesisExpression = exports.isParam = exports.isOptionalChainingExpression = void 0;
exports.isWhileStatement = exports.isVariableDeclarator = exports.isVariableDeclaration = exports.isUpdateExpression = exports.isUnaryExpression = exports.isTsTypeParameterInstantiation = exports.isTsTypeParameterDeclaration = exports.isTsTypeParameter = exports.isTsTypeElement = exports.isTsTypeAssertion = exports.isTsTypeAnnotation = exports.isTsTypeAliasDeclaration = exports.isTsType = exports.isTsImportType = exports.isTsTypePredicate = exports.isTsLiteralType = exports.isTsMappedType = exports.isTsIndexedAccessType = exports.isTsTypeOperator = exports.isTsParenthesizedType = exports.isTsInferType = exports.isTsConditionalType = exports.isTsUnionOrIntersectionType = exports.isTsIntersectionType = exports.isTsUnionType = exports.isTsRestType = exports.isTsOptionalType = exports.isTsTupleType = exports.isTsArrayType = exports.isTsTypeLiteral = exports.isTsTypeQuery = exports.isTsTypeReference = exports.isTsFnOrConstructorType = exports.isTsConstructorType = exports.isTsFunctionType = exports.isTsThisType = exports.isTsKeywordType = exports.isTsSetterSignature = exports.isTsQualifiedName = exports.isTsPropertySignature = exports.isTsParameterPropertyParameter = exports.isTsParameterProperty = exports.isTsNonNullExpression = exports.isTsNamespaceExportDeclaration = exports.isTsNamespaceDeclaration = exports.isTsNamespaceBody = exports.isTsModuleReference = exports.isTsEntityName = exports.isTsModuleName = exports.isTsModuleDeclaration = void 0;
exports.isYieldExpression = exports.isWithStatement = void 0;
const tslib_1 = require("tslib");
const Visitor_1 = tslib_1.__importDefault(require("@swc/core/Visitor"));
function isNode(node) {
    return typeof node === 'object' && node !== null && typeof node === 'object' && 'type' in node;
}
exports.isNode = isNode;
function isHasSpan(node) {
    return typeof node === 'object' && node !== null && typeof node === 'object' && 'span' in node;
}
exports.isHasSpan = isHasSpan;
class BaseVistor extends Visitor_1.default {
    constructor(context) {
        super();
        this.handleProgram = context === null || context === void 0 ? void 0 : context.visitProgram;
        this.handleModule = context === null || context === void 0 ? void 0 : context.visitModule;
        this.handleScript = context === null || context === void 0 ? void 0 : context.visitScript;
        this.handleModuleItems = context === null || context === void 0 ? void 0 : context.visitModuleItems;
        this.handleModuleItem = context === null || context === void 0 ? void 0 : context.visitModuleItem;
        this.handleModuleDeclaration = context === null || context === void 0 ? void 0 : context.visitModuleDeclaration;
        this.handleTsNamespaceExportDeclaration = context === null || context === void 0 ? void 0 : context.visitTsNamespaceExportDeclaration;
        this.handleTsExportAssignment = context === null || context === void 0 ? void 0 : context.visitTsExportAssignment;
        this.handleTsImportEqualsDeclaration = context === null || context === void 0 ? void 0 : context.visitTsImportEqualsDeclaration;
        this.handleTsModuleReference = context === null || context === void 0 ? void 0 : context.visitTsModuleReference;
        this.handleTsExternalModuleReference = context === null || context === void 0 ? void 0 : context.visitTsExternalModuleReference;
        this.handleExportAllDeclaration = context === null || context === void 0 ? void 0 : context.visitExportAllDeclaration;
        this.handleExportDefaultExpression = context === null || context === void 0 ? void 0 : context.visitExportDefaultExpression;
        this.handleExportNamedDeclaration = context === null || context === void 0 ? void 0 : context.visitExportNamedDeclaration;
        this.handleExportSpecifiers = context === null || context === void 0 ? void 0 : context.visitExportSpecifiers;
        this.handleExportSpecifier = context === null || context === void 0 ? void 0 : context.visitExportSpecifier;
        this.handleNamedExportSpecifier = context === null || context === void 0 ? void 0 : context.visitNamedExportSpecifier;
        this.handleModuleExportName = context === null || context === void 0 ? void 0 : context.visitModuleExportName;
        this.handleExportNamespaceSpecifier = context === null || context === void 0 ? void 0 : context.visitExportNamespaceSpecifier;
        this.handleExportDefaultSpecifier = context === null || context === void 0 ? void 0 : context.visitExportDefaultSpecifier;
        this.handleOptionalStringLiteral = context === null || context === void 0 ? void 0 : context.visitOptionalStringLiteral;
        this.handleExportDefaultDeclaration = context === null || context === void 0 ? void 0 : context.visitExportDefaultDeclaration;
        this.handleDefaultDeclaration = context === null || context === void 0 ? void 0 : context.visitDefaultDeclaration;
        this.handleFunctionExpression = context === null || context === void 0 ? void 0 : context.visitFunctionExpression;
        this.handleClassExpression = context === null || context === void 0 ? void 0 : context.visitClassExpression;
        this.handleExportDeclaration = context === null || context === void 0 ? void 0 : context.visitExportDeclaration;
        this.handleArrayExpression = context === null || context === void 0 ? void 0 : context.visitArrayExpression;
        this.handleArrayElement = context === null || context === void 0 ? void 0 : context.visitArrayElement;
        this.handleExprOrSpread = context === null || context === void 0 ? void 0 : context.visitExprOrSpread;
        this.handleExprOrSpreads = context === null || context === void 0 ? void 0 : context.visitExprOrSpreads;
        this.handleSpreadElement = context === null || context === void 0 ? void 0 : context.visitSpreadElement;
        this.handleOptionalExpression = context === null || context === void 0 ? void 0 : context.visitOptionalExpression;
        this.handleArrowFunctionExpression = context === null || context === void 0 ? void 0 : context.visitArrowFunctionExpression;
        this.handleArrowBody = context === null || context === void 0 ? void 0 : context.visitArrowBody;
        this.handleBlockStatement = context === null || context === void 0 ? void 0 : context.visitBlockStatement;
        this.handleStatements = context === null || context === void 0 ? void 0 : context.visitStatements;
        this.handleStatement = context === null || context === void 0 ? void 0 : context.visitStatement;
        this.handleSwitchStatement = context === null || context === void 0 ? void 0 : context.visitSwitchStatement;
        this.handleSwitchCases = context === null || context === void 0 ? void 0 : context.visitSwitchCases;
        this.handleSwitchCase = context === null || context === void 0 ? void 0 : context.visitSwitchCase;
        this.handleIfStatement = context === null || context === void 0 ? void 0 : context.visitIfStatement;
        this.handleOptionalStatement = context === null || context === void 0 ? void 0 : context.visitOptionalStatement;
        this.handleBreakStatement = context === null || context === void 0 ? void 0 : context.visitBreakStatement;
        this.handleWhileStatement = context === null || context === void 0 ? void 0 : context.visitWhileStatement;
        this.handleTryStatement = context === null || context === void 0 ? void 0 : context.visitTryStatement;
        this.handleCatchClause = context === null || context === void 0 ? void 0 : context.visitCatchClause;
        this.handleThrowStatement = context === null || context === void 0 ? void 0 : context.visitThrowStatement;
        this.handleReturnStatement = context === null || context === void 0 ? void 0 : context.visitReturnStatement;
        this.handleLabeledStatement = context === null || context === void 0 ? void 0 : context.visitLabeledStatement;
        this.handleForStatement = context === null || context === void 0 ? void 0 : context.visitForStatement;
        this.handleForOfStatement = context === null || context === void 0 ? void 0 : context.visitForOfStatement;
        this.handleForInStatement = context === null || context === void 0 ? void 0 : context.visitForInStatement;
        this.handleEmptyStatement = context === null || context === void 0 ? void 0 : context.visitEmptyStatement;
        this.handleDoWhileStatement = context === null || context === void 0 ? void 0 : context.visitDoWhileStatement;
        this.handleDebuggerStatement = context === null || context === void 0 ? void 0 : context.visitDebuggerStatement;
        this.handleWithStatement = context === null || context === void 0 ? void 0 : context.visitWithStatement;
        this.handleDeclaration = context === null || context === void 0 ? void 0 : context.visitDeclaration;
        this.handleVariableDeclaration = context === null || context === void 0 ? void 0 : context.visitVariableDeclaration;
        this.handleVariableDeclarators = context === null || context === void 0 ? void 0 : context.visitVariableDeclarators;
        this.handleVariableDeclarator = context === null || context === void 0 ? void 0 : context.visitVariableDeclarator;
        this.handleTsTypeAliasDeclaration = context === null || context === void 0 ? void 0 : context.visitTsTypeAliasDeclaration;
        this.handleTsModuleDeclaration = context === null || context === void 0 ? void 0 : context.visitTsModuleDeclaration;
        this.handleTsModuleName = context === null || context === void 0 ? void 0 : context.visitTsModuleName;
        this.handleTsNamespaceBody = context === null || context === void 0 ? void 0 : context.visitTsNamespaceBody;
        this.handleTsNamespaceDeclaration = context === null || context === void 0 ? void 0 : context.visitTsNamespaceDeclaration;
        this.handleTsModuleBlock = context === null || context === void 0 ? void 0 : context.visitTsModuleBlock;
        this.handleTsInterfaceDeclaration = context === null || context === void 0 ? void 0 : context.visitTsInterfaceDeclaration;
        this.handleTsInterfaceBody = context === null || context === void 0 ? void 0 : context.visitTsInterfaceBody;
        this.handleTsTypeElements = context === null || context === void 0 ? void 0 : context.visitTsTypeElements;
        this.handleTsTypeElement = context === null || context === void 0 ? void 0 : context.visitTsTypeElement;
        this.handleTsCallSignatureDeclaration = context === null || context === void 0 ? void 0 : context.visitTsCallSignatureDeclaration;
        this.handleTsConstructSignatureDeclaration = context === null || context === void 0 ? void 0 : context.visitTsConstructSignatureDeclaration;
        this.handleTsPropertySignature = context === null || context === void 0 ? void 0 : context.visitTsPropertySignature;
        this.handleTsGetterSignature = context === null || context === void 0 ? void 0 : context.visitTsGetterSignature;
        this.handleTsSetterSignature = context === null || context === void 0 ? void 0 : context.visitTsSetterSignature;
        this.handleTsMethodSignature = context === null || context === void 0 ? void 0 : context.visitTsMethodSignature;
        this.handleTsEnumDeclaration = context === null || context === void 0 ? void 0 : context.visitTsEnumDeclaration;
        this.handleTsEnumMembers = context === null || context === void 0 ? void 0 : context.visitTsEnumMembers;
        this.handleTsEnumMember = context === null || context === void 0 ? void 0 : context.visitTsEnumMember;
        this.handleTsEnumMemberId = context === null || context === void 0 ? void 0 : context.visitTsEnumMemberId;
        this.handleFunctionDeclaration = context === null || context === void 0 ? void 0 : context.visitFunctionDeclaration;
        this.handleClassDeclaration = context === null || context === void 0 ? void 0 : context.visitClassDeclaration;
        this.handleClassBody = context === null || context === void 0 ? void 0 : context.visitClassBody;
        this.handleClassMember = context === null || context === void 0 ? void 0 : context.visitClassMember;
        this.handleTsIndexSignature = context === null || context === void 0 ? void 0 : context.visitTsIndexSignature;
        this.handleTsFnParameters = context === null || context === void 0 ? void 0 : context.visitTsFnParameters;
        this.handleTsFnParameter = context === null || context === void 0 ? void 0 : context.visitTsFnParameter;
        this.handlePrivateProperty = context === null || context === void 0 ? void 0 : context.visitPrivateProperty;
        this.handlePrivateMethod = context === null || context === void 0 ? void 0 : context.visitPrivateMethod;
        this.handlePrivateName = context === null || context === void 0 ? void 0 : context.visitPrivateName;
        this.handleConstructor = context === null || context === void 0 ? void 0 : context.visitConstructor;
        this.handleConstructorParameters = context === null || context === void 0 ? void 0 : context.visitConstructorParameters;
        this.handleConstructorParameter = context === null || context === void 0 ? void 0 : context.visitConstructorParameter;
        this.handleStaticBlock = context === null || context === void 0 ? void 0 : context.visitStaticBlock;
        this.handleTsParameterProperty = context === null || context === void 0 ? void 0 : context.visitTsParameterProperty;
        this.handleTsParameterPropertyParameter = context === null || context === void 0 ? void 0 : context.visitTsParameterPropertyParameter;
        this.handlePropertyName = context === null || context === void 0 ? void 0 : context.visitPropertyName;
        this.handleAccessibility = context === null || context === void 0 ? void 0 : context.visitAccessibility;
        this.handleClassProperty = context === null || context === void 0 ? void 0 : context.visitClassProperty;
        this.handleClassMethod = context === null || context === void 0 ? void 0 : context.visitClassMethod;
        this.handleComputedPropertyKey = context === null || context === void 0 ? void 0 : context.visitComputedPropertyKey;
        this.handleClass = context === null || context === void 0 ? void 0 : context.visitClass;
        this.handleFunction = context === null || context === void 0 ? void 0 : context.visitFunction;
        this.handleTsExpressionsWithTypeArguments = context === null || context === void 0 ? void 0 : context.visitTsExpressionsWithTypeArguments;
        this.handleTsExpressionWithTypeArguments = context === null || context === void 0 ? void 0 : context.visitTsExpressionWithTypeArguments;
        this.handleTsTypeParameterInstantiation = context === null || context === void 0 ? void 0 : context.visitTsTypeParameterInstantiation;
        this.handleTsTypes = context === null || context === void 0 ? void 0 : context.visitTsTypes;
        this.handleTsEntityName = context === null || context === void 0 ? void 0 : context.visitTsEntityName;
        this.handleTsQualifiedName = context === null || context === void 0 ? void 0 : context.visitTsQualifiedName;
        this.handleDecorators = context === null || context === void 0 ? void 0 : context.visitDecorators;
        this.handleDecorator = context === null || context === void 0 ? void 0 : context.visitDecorator;
        this.handleExpressionStatement = context === null || context === void 0 ? void 0 : context.visitExpressionStatement;
        this.handleContinueStatement = context === null || context === void 0 ? void 0 : context.visitContinueStatement;
        this.handleExpression = context === null || context === void 0 ? void 0 : context.visitExpression;
        this.handleOptionalChainingExpression = context === null || context === void 0 ? void 0 : context.visitOptionalChainingExpression;
        this.handleMemberExpressionOrOptionalChainingCall = context === null || context === void 0 ? void 0 : context.visitMemberExpressionOrOptionalChainingCall;
        this.handleOptionalChainingCall = context === null || context === void 0 ? void 0 : context.visitOptionalChainingCall;
        this.handleAssignmentExpression = context === null || context === void 0 ? void 0 : context.visitAssignmentExpression;
        this.handlePatternOrExpression = context === null || context === void 0 ? void 0 : context.visitPatternOrExpression;
        this.handleYieldExpression = context === null || context === void 0 ? void 0 : context.visitYieldExpression;
        this.handleUpdateExpression = context === null || context === void 0 ? void 0 : context.visitUpdateExpression;
        this.handleUnaryExpression = context === null || context === void 0 ? void 0 : context.visitUnaryExpression;
        this.handleTsTypeAssertion = context === null || context === void 0 ? void 0 : context.visitTsTypeAssertion;
        this.handleTsConstAssertion = context === null || context === void 0 ? void 0 : context.visitTsConstAssertion;
        this.handleTsInstantiation = context === null || context === void 0 ? void 0 : context.visitTsInstantiation;
        this.handleTsNonNullExpression = context === null || context === void 0 ? void 0 : context.visitTsNonNullExpression;
        this.handleTsAsExpression = context === null || context === void 0 ? void 0 : context.visitTsAsExpression;
        this.handleThisExpression = context === null || context === void 0 ? void 0 : context.visitThisExpression;
        this.handleTemplateLiteral = context === null || context === void 0 ? void 0 : context.visitTemplateLiteral;
        this.handleParameters = context === null || context === void 0 ? void 0 : context.visitParameters;
        this.handleParameter = context === null || context === void 0 ? void 0 : context.visitParameter;
        this.handleTaggedTemplateExpression = context === null || context === void 0 ? void 0 : context.visitTaggedTemplateExpression;
        this.handleSequenceExpression = context === null || context === void 0 ? void 0 : context.visitSequenceExpression;
        this.handleRegExpLiteral = context === null || context === void 0 ? void 0 : context.visitRegExpLiteral;
        this.handleParenthesisExpression = context === null || context === void 0 ? void 0 : context.visitParenthesisExpression;
        this.handleObjectExpression = context === null || context === void 0 ? void 0 : context.visitObjectExpression;
        this.handleObjectProperties = context === null || context === void 0 ? void 0 : context.visitObjectProperties;
        this.handleObjectProperty = context === null || context === void 0 ? void 0 : context.visitObjectProperty;
        this.handleProperty = context === null || context === void 0 ? void 0 : context.visitProperty;
        this.handleSetterProperty = context === null || context === void 0 ? void 0 : context.visitSetterProperty;
        this.handleMethodProperty = context === null || context === void 0 ? void 0 : context.visitMethodProperty;
        this.handleKeyValueProperty = context === null || context === void 0 ? void 0 : context.visitKeyValueProperty;
        this.handleGetterProperty = context === null || context === void 0 ? void 0 : context.visitGetterProperty;
        this.handleAssignmentProperty = context === null || context === void 0 ? void 0 : context.visitAssignmentProperty;
        this.handleNullLiteral = context === null || context === void 0 ? void 0 : context.visitNullLiteral;
        this.handleNewExpression = context === null || context === void 0 ? void 0 : context.visitNewExpression;
        this.handleTsTypeArguments = context === null || context === void 0 ? void 0 : context.visitTsTypeArguments;
        this.handleArguments = context === null || context === void 0 ? void 0 : context.visitArguments;
        this.handleArgument = context === null || context === void 0 ? void 0 : context.visitArgument;
        this.handleMetaProperty = context === null || context === void 0 ? void 0 : context.visitMetaProperty;
        this.handleMemberExpression = context === null || context === void 0 ? void 0 : context.visitMemberExpression;
        this.handleSuperPropExpression = context === null || context === void 0 ? void 0 : context.visitSuperPropExpression;
        this.handleCallee = context === null || context === void 0 ? void 0 : context.visitCallee;
        this.handleJSXText = context === null || context === void 0 ? void 0 : context.visitJSXText;
        this.handleJSXNamespacedName = context === null || context === void 0 ? void 0 : context.visitJSXNamespacedName;
        this.handleJSXMemberExpression = context === null || context === void 0 ? void 0 : context.visitJSXMemberExpression;
        this.handleJSXObject = context === null || context === void 0 ? void 0 : context.visitJSXObject;
        this.handleJSXFragment = context === null || context === void 0 ? void 0 : context.visitJSXFragment;
        this.handleJSXClosingFragment = context === null || context === void 0 ? void 0 : context.visitJSXClosingFragment;
        this.handleJSXElementChildren = context === null || context === void 0 ? void 0 : context.visitJSXElementChildren;
        this.handleJSXElementChild = context === null || context === void 0 ? void 0 : context.visitJSXElementChild;
        this.handleJSXExpressionContainer = context === null || context === void 0 ? void 0 : context.visitJSXExpressionContainer;
        this.handleJSXSpreadChild = context === null || context === void 0 ? void 0 : context.visitJSXSpreadChild;
        this.handleJSXOpeningFragment = context === null || context === void 0 ? void 0 : context.visitJSXOpeningFragment;
        this.handleJSXEmptyExpression = context === null || context === void 0 ? void 0 : context.visitJSXEmptyExpression;
        this.handleJSXElement = context === null || context === void 0 ? void 0 : context.visitJSXElement;
        this.handleJSXClosingElement = context === null || context === void 0 ? void 0 : context.visitJSXClosingElement;
        this.handleJSXElementName = context === null || context === void 0 ? void 0 : context.visitJSXElementName;
        this.handleJSXOpeningElement = context === null || context === void 0 ? void 0 : context.visitJSXOpeningElement;
        this.handleJSXAttributes = context === null || context === void 0 ? void 0 : context.visitJSXAttributes;
        this.handleJSXAttributeOrSpread = context === null || context === void 0 ? void 0 : context.visitJSXAttributeOrSpread;
        this.handleJSXAttributeOrSpreads = context === null || context === void 0 ? void 0 : context.visitJSXAttributeOrSpreads;
        this.handleJSXAttribute = context === null || context === void 0 ? void 0 : context.visitJSXAttribute;
        this.handleJSXAttributeValue = context === null || context === void 0 ? void 0 : context.visitJSXAttributeValue;
        this.handleJSXAttributeName = context === null || context === void 0 ? void 0 : context.visitJSXAttributeName;
        this.handleConditionalExpression = context === null || context === void 0 ? void 0 : context.visitConditionalExpression;
        this.handleCallExpression = context === null || context === void 0 ? void 0 : context.visitCallExpression;
        this.handleBooleanLiteral = context === null || context === void 0 ? void 0 : context.visitBooleanLiteral;
        this.handleBinaryExpression = context === null || context === void 0 ? void 0 : context.visitBinaryExpression;
        this.handleAwaitExpression = context === null || context === void 0 ? void 0 : context.visitAwaitExpression;
        this.handleTsTypeParameterDeclaration = context === null || context === void 0 ? void 0 : context.visitTsTypeParameterDeclaration;
        this.handleTsTypeParameters = context === null || context === void 0 ? void 0 : context.visitTsTypeParameters;
        this.handleTsTypeParameter = context === null || context === void 0 ? void 0 : context.visitTsTypeParameter;
        this.handleTsTypeAnnotation = context === null || context === void 0 ? void 0 : context.visitTsTypeAnnotation;
        this.handleTsType = context === null || context === void 0 ? void 0 : context.visitTsType;
        this.handlePatterns = context === null || context === void 0 ? void 0 : context.visitPatterns;
        this.handleImportDeclaration = context === null || context === void 0 ? void 0 : context.visitImportDeclaration;
        this.handleImportSpecifiers = context === null || context === void 0 ? void 0 : context.visitImportSpecifiers;
        this.handleImportSpecifier = context === null || context === void 0 ? void 0 : context.visitImportSpecifier;
        this.handleNamedImportSpecifier = context === null || context === void 0 ? void 0 : context.visitNamedImportSpecifier;
        this.handleImportNamespaceSpecifier = context === null || context === void 0 ? void 0 : context.visitImportNamespaceSpecifier;
        this.handleImportDefaultSpecifier = context === null || context === void 0 ? void 0 : context.visitImportDefaultSpecifier;
        this.handleBindingIdentifier = context === null || context === void 0 ? void 0 : context.visitBindingIdentifier;
        this.handleIdentifierReference = context === null || context === void 0 ? void 0 : context.visitIdentifierReference;
        this.handleLabelIdentifier = context === null || context === void 0 ? void 0 : context.visitLabelIdentifier;
        this.handleIdentifier = context === null || context === void 0 ? void 0 : context.visitIdentifier;
        this.handleStringLiteral = context === null || context === void 0 ? void 0 : context.visitStringLiteral;
        this.handleNumericLiteral = context === null || context === void 0 ? void 0 : context.visitNumericLiteral;
        this.handleBigIntLiteral = context === null || context === void 0 ? void 0 : context.visitBigIntLiteral;
        this.handlePattern = context === null || context === void 0 ? void 0 : context.visitPattern;
        this.handleRestElement = context === null || context === void 0 ? void 0 : context.visitRestElement;
        this.handleAssignmentPattern = context === null || context === void 0 ? void 0 : context.visitAssignmentPattern;
        this.handleObjectPattern = context === null || context === void 0 ? void 0 : context.visitObjectPattern;
        this.handleObjectPatternProperties = context === null || context === void 0 ? void 0 : context.visitObjectPatternProperties;
        this.handleObjectPatternProperty = context === null || context === void 0 ? void 0 : context.visitObjectPatternProperty;
        this.handleKeyValuePatternProperty = context === null || context === void 0 ? void 0 : context.visitKeyValuePatternProperty;
        this.handleAssignmentPatternProperty = context === null || context === void 0 ? void 0 : context.visitAssignmentPatternProperty;
        this.handleArrayPattern = context === null || context === void 0 ? void 0 : context.visitArrayPattern;
        this.handleArrayPatternElements = context === null || context === void 0 ? void 0 : context.visitArrayPatternElements;
        this.handleArrayPatternElement = context === null || context === void 0 ? void 0 : context.visitArrayPatternElement;
    }
    visitProgram(m) {
        var _a;
        (_a = this.handleProgram) === null || _a === void 0 ? void 0 : _a.call(this, m);
        return super.visitProgram(m);
    }
    visitModule(m) {
        var _a;
        (_a = this.handleModule) === null || _a === void 0 ? void 0 : _a.call(this, m);
        return super.visitModule(m);
    }
    visitScript(m) {
        var _a;
        (_a = this.handleScript) === null || _a === void 0 ? void 0 : _a.call(this, m);
        return super.visitScript(m);
    }
    visitModuleItems(items) {
        var _a;
        (_a = this.handleModuleItems) === null || _a === void 0 ? void 0 : _a.call(this, items);
        return super.visitModuleItems(items);
    }
    visitModuleItem(n) {
        var _a;
        (_a = this.handleModuleItem) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitModuleItem(n);
    }
    visitModuleDeclaration(n) {
        var _a;
        (_a = this.handleModuleDeclaration) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitModuleDeclaration(n);
    }
    visitTsNamespaceExportDeclaration(n) {
        var _a;
        (_a = this.handleTsNamespaceExportDeclaration) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsNamespaceExportDeclaration(n);
    }
    visitTsExportAssignment(n) {
        var _a;
        (_a = this.handleTsExportAssignment) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsExportAssignment(n);
    }
    visitTsImportEqualsDeclaration(n) {
        var _a;
        (_a = this.handleTsImportEqualsDeclaration) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsImportEqualsDeclaration(n);
    }
    visitTsModuleReference(n) {
        var _a;
        (_a = this.handleTsModuleReference) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsModuleReference(n);
    }
    visitTsExternalModuleReference(n) {
        var _a;
        (_a = this.handleTsExternalModuleReference) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsExternalModuleReference(n);
    }
    visitExportAllDeclaration(n) {
        var _a;
        (_a = this.handleExportAllDeclaration) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitExportAllDeclaration(n);
    }
    visitExportDefaultExpression(n) {
        var _a;
        (_a = this.handleExportDefaultExpression) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitExportDefaultExpression(n);
    }
    visitExportNamedDeclaration(n) {
        var _a;
        (_a = this.handleExportNamedDeclaration) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitExportNamedDeclaration(n);
    }
    visitExportSpecifiers(nodes) {
        var _a;
        (_a = this.handleExportSpecifiers) === null || _a === void 0 ? void 0 : _a.call(this, nodes);
        return super.visitExportSpecifiers(nodes);
    }
    visitExportSpecifier(n) {
        var _a;
        (_a = this.handleExportSpecifier) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitExportSpecifier(n);
    }
    visitNamedExportSpecifier(n) {
        var _a;
        (_a = this.handleNamedExportSpecifier) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitNamedExportSpecifier(n);
    }
    visitModuleExportName(n) {
        var _a;
        (_a = this.handleModuleExportName) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitModuleExportName(n);
    }
    visitExportNamespaceSpecifier(n) {
        var _a;
        (_a = this.handleExportNamespaceSpecifier) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitExportNamespaceSpecifier(n);
    }
    visitExportDefaultSpecifier(n) {
        var _a;
        (_a = this.handleExportDefaultSpecifier) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitExportDefaultSpecifier(n);
    }
    visitOptionalStringLiteral(n) {
        var _a;
        (_a = this.handleOptionalStringLiteral) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitOptionalStringLiteral(n);
    }
    visitExportDefaultDeclaration(n) {
        var _a;
        (_a = this.handleExportDefaultDeclaration) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitExportDefaultDeclaration(n);
    }
    visitDefaultDeclaration(n) {
        var _a;
        (_a = this.handleDefaultDeclaration) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitDefaultDeclaration(n);
    }
    visitFunctionExpression(n) {
        var _a;
        (_a = this.handleFunctionExpression) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitFunctionExpression(n);
    }
    visitClassExpression(n) {
        var _a;
        (_a = this.handleClassExpression) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitClassExpression(n);
    }
    visitExportDeclaration(n) {
        var _a;
        (_a = this.handleExportDeclaration) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitExportDeclaration(n);
    }
    visitArrayExpression(e) {
        var _a;
        (_a = this.handleArrayExpression) === null || _a === void 0 ? void 0 : _a.call(this, e);
        return super.visitArrayExpression(e);
    }
    visitArrayElement(e) {
        var _a;
        (_a = this.handleArrayElement) === null || _a === void 0 ? void 0 : _a.call(this, e);
        return super.visitArrayElement(e);
    }
    visitExprOrSpread(e) {
        var _a;
        (_a = this.handleExprOrSpread) === null || _a === void 0 ? void 0 : _a.call(this, e);
        return super.visitExprOrSpread(e);
    }
    visitExprOrSpreads(nodes) {
        var _a;
        (_a = this.handleExprOrSpreads) === null || _a === void 0 ? void 0 : _a.call(this, nodes);
        return super.visitExprOrSpreads(nodes);
    }
    visitSpreadElement(e) {
        var _a;
        (_a = this.handleSpreadElement) === null || _a === void 0 ? void 0 : _a.call(this, e);
        return super.visitSpreadElement(e);
    }
    visitOptionalExpression(e) {
        var _a;
        (_a = this.handleOptionalExpression) === null || _a === void 0 ? void 0 : _a.call(this, e);
        return super.visitOptionalExpression(e);
    }
    visitArrowFunctionExpression(e) {
        var _a;
        (_a = this.handleArrowFunctionExpression) === null || _a === void 0 ? void 0 : _a.call(this, e);
        return super.visitArrowFunctionExpression(e);
    }
    visitArrowBody(body) {
        var _a;
        (_a = this.handleArrowBody) === null || _a === void 0 ? void 0 : _a.call(this, body);
        return super.visitArrowBody(body);
    }
    visitBlockStatement(block) {
        var _a;
        (_a = this.handleBlockStatement) === null || _a === void 0 ? void 0 : _a.call(this, block);
        return super.visitBlockStatement(block);
    }
    visitStatements(stmts) {
        var _a;
        (_a = this.handleStatements) === null || _a === void 0 ? void 0 : _a.call(this, stmts);
        return super.visitStatements(stmts);
    }
    visitStatement(stmt) {
        var _a;
        (_a = this.handleStatement) === null || _a === void 0 ? void 0 : _a.call(this, stmt);
        return super.visitStatement(stmt);
    }
    visitSwitchStatement(stmt) {
        var _a;
        (_a = this.handleSwitchStatement) === null || _a === void 0 ? void 0 : _a.call(this, stmt);
        return super.visitSwitchStatement(stmt);
    }
    visitSwitchCases(cases) {
        var _a;
        (_a = this.handleSwitchCases) === null || _a === void 0 ? void 0 : _a.call(this, cases);
        return super.visitSwitchCases(cases);
    }
    visitSwitchCase(c) {
        var _a;
        (_a = this.handleSwitchCase) === null || _a === void 0 ? void 0 : _a.call(this, c);
        return super.visitSwitchCase(c);
    }
    visitIfStatement(stmt) {
        var _a;
        (_a = this.handleIfStatement) === null || _a === void 0 ? void 0 : _a.call(this, stmt);
        return super.visitIfStatement(stmt);
    }
    visitOptionalStatement(stmt) {
        var _a;
        (_a = this.handleOptionalStatement) === null || _a === void 0 ? void 0 : _a.call(this, stmt);
        return super.visitOptionalStatement(stmt);
    }
    visitBreakStatement(stmt) {
        var _a;
        (_a = this.handleBreakStatement) === null || _a === void 0 ? void 0 : _a.call(this, stmt);
        return super.visitBreakStatement(stmt);
    }
    visitWhileStatement(stmt) {
        var _a;
        (_a = this.handleWhileStatement) === null || _a === void 0 ? void 0 : _a.call(this, stmt);
        return super.visitWhileStatement(stmt);
    }
    visitTryStatement(stmt) {
        var _a;
        (_a = this.handleTryStatement) === null || _a === void 0 ? void 0 : _a.call(this, stmt);
        return super.visitTryStatement(stmt);
    }
    visitCatchClause(handler) {
        var _a;
        (_a = this.handleCatchClause) === null || _a === void 0 ? void 0 : _a.call(this, handler);
        return super.visitCatchClause(handler);
    }
    visitThrowStatement(stmt) {
        var _a;
        (_a = this.handleThrowStatement) === null || _a === void 0 ? void 0 : _a.call(this, stmt);
        return super.visitThrowStatement(stmt);
    }
    visitReturnStatement(stmt) {
        var _a;
        (_a = this.handleReturnStatement) === null || _a === void 0 ? void 0 : _a.call(this, stmt);
        return super.visitReturnStatement(stmt);
    }
    visitLabeledStatement(stmt) {
        var _a;
        (_a = this.handleLabeledStatement) === null || _a === void 0 ? void 0 : _a.call(this, stmt);
        return super.visitLabeledStatement(stmt);
    }
    visitForStatement(stmt) {
        var _a;
        (_a = this.handleForStatement) === null || _a === void 0 ? void 0 : _a.call(this, stmt);
        return super.visitForStatement(stmt);
    }
    visitForOfStatement(stmt) {
        var _a;
        (_a = this.handleForOfStatement) === null || _a === void 0 ? void 0 : _a.call(this, stmt);
        return super.visitForOfStatement(stmt);
    }
    visitForInStatement(stmt) {
        var _a;
        (_a = this.handleForInStatement) === null || _a === void 0 ? void 0 : _a.call(this, stmt);
        return super.visitForInStatement(stmt);
    }
    visitEmptyStatement(stmt) {
        var _a;
        (_a = this.handleEmptyStatement) === null || _a === void 0 ? void 0 : _a.call(this, stmt);
        return super.visitEmptyStatement(stmt);
    }
    visitDoWhileStatement(stmt) {
        var _a;
        (_a = this.handleDoWhileStatement) === null || _a === void 0 ? void 0 : _a.call(this, stmt);
        return super.visitDoWhileStatement(stmt);
    }
    visitDebuggerStatement(stmt) {
        var _a;
        (_a = this.handleDebuggerStatement) === null || _a === void 0 ? void 0 : _a.call(this, stmt);
        return super.visitDebuggerStatement(stmt);
    }
    visitWithStatement(stmt) {
        var _a;
        (_a = this.handleWithStatement) === null || _a === void 0 ? void 0 : _a.call(this, stmt);
        return super.visitWithStatement(stmt);
    }
    visitDeclaration(decl) {
        var _a;
        (_a = this.handleDeclaration) === null || _a === void 0 ? void 0 : _a.call(this, decl);
        return super.visitDeclaration(decl);
    }
    visitVariableDeclaration(n) {
        var _a;
        (_a = this.handleVariableDeclaration) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitVariableDeclaration(n);
    }
    visitVariableDeclarators(nodes) {
        var _a;
        (_a = this.handleVariableDeclarators) === null || _a === void 0 ? void 0 : _a.call(this, nodes);
        return super.visitVariableDeclarators(nodes);
    }
    visitVariableDeclarator(n) {
        var _a;
        (_a = this.handleVariableDeclarator) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitVariableDeclarator(n);
    }
    visitTsTypeAliasDeclaration(n) {
        var _a;
        (_a = this.handleTsTypeAliasDeclaration) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsTypeAliasDeclaration(n);
    }
    visitTsModuleDeclaration(n) {
        var _a;
        (_a = this.handleTsModuleDeclaration) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsModuleDeclaration(n);
    }
    visitTsModuleName(n) {
        var _a;
        (_a = this.handleTsModuleName) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsModuleName(n);
    }
    visitTsNamespaceBody(n) {
        var _a;
        (_a = this.handleTsNamespaceBody) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsNamespaceBody(n);
    }
    visitTsNamespaceDeclaration(n) {
        var _a;
        (_a = this.handleTsNamespaceDeclaration) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsNamespaceDeclaration(n);
    }
    visitTsModuleBlock(n) {
        var _a;
        (_a = this.handleTsModuleBlock) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsModuleBlock(n);
    }
    visitTsInterfaceDeclaration(n) {
        var _a;
        (_a = this.handleTsInterfaceDeclaration) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsInterfaceDeclaration(n);
    }
    visitTsInterfaceBody(n) {
        var _a;
        (_a = this.handleTsInterfaceBody) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsInterfaceBody(n);
    }
    visitTsTypeElements(nodes) {
        var _a;
        (_a = this.handleTsTypeElements) === null || _a === void 0 ? void 0 : _a.call(this, nodes);
        return super.visitTsTypeElements(nodes);
    }
    visitTsTypeElement(n) {
        var _a;
        (_a = this.handleTsTypeElement) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsTypeElement(n);
    }
    visitTsCallSignatureDeclaration(n) {
        var _a;
        (_a = this.handleTsCallSignatureDeclaration) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsCallSignatureDeclaration(n);
    }
    visitTsConstructSignatureDeclaration(n) {
        var _a;
        (_a = this.handleTsConstructSignatureDeclaration) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsConstructSignatureDeclaration(n);
    }
    visitTsPropertySignature(n) {
        var _a;
        (_a = this.handleTsPropertySignature) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsPropertySignature(n);
    }
    visitTsGetterSignature(n) {
        var _a;
        (_a = this.handleTsGetterSignature) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsGetterSignature(n);
    }
    visitTsSetterSignature(n) {
        var _a;
        (_a = this.handleTsSetterSignature) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsSetterSignature(n);
    }
    visitTsMethodSignature(n) {
        var _a;
        (_a = this.handleTsMethodSignature) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsMethodSignature(n);
    }
    visitTsEnumDeclaration(n) {
        var _a;
        (_a = this.handleTsEnumDeclaration) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsEnumDeclaration(n);
    }
    visitTsEnumMembers(nodes) {
        var _a;
        (_a = this.handleTsEnumMembers) === null || _a === void 0 ? void 0 : _a.call(this, nodes);
        return super.visitTsEnumMembers(nodes);
    }
    visitTsEnumMember(n) {
        var _a;
        (_a = this.handleTsEnumMember) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsEnumMember(n);
    }
    visitTsEnumMemberId(n) {
        var _a;
        (_a = this.handleTsEnumMemberId) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsEnumMemberId(n);
    }
    visitFunctionDeclaration(decl) {
        var _a;
        (_a = this.handleFunctionDeclaration) === null || _a === void 0 ? void 0 : _a.call(this, decl);
        return super.visitFunctionDeclaration(decl);
    }
    visitClassDeclaration(decl) {
        var _a;
        (_a = this.handleClassDeclaration) === null || _a === void 0 ? void 0 : _a.call(this, decl);
        return super.visitClassDeclaration(decl);
    }
    visitClassBody(members) {
        var _a;
        (_a = this.handleClassBody) === null || _a === void 0 ? void 0 : _a.call(this, members);
        return super.visitClassBody(members);
    }
    visitClassMember(member) {
        var _a;
        (_a = this.handleClassMember) === null || _a === void 0 ? void 0 : _a.call(this, member);
        return super.visitClassMember(member);
    }
    visitTsIndexSignature(n) {
        var _a;
        (_a = this.handleTsIndexSignature) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsIndexSignature(n);
    }
    visitTsFnParameters(params) {
        var _a;
        (_a = this.handleTsFnParameters) === null || _a === void 0 ? void 0 : _a.call(this, params);
        return super.visitTsFnParameters(params);
    }
    visitTsFnParameter(n) {
        var _a;
        (_a = this.handleTsFnParameter) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsFnParameter(n);
    }
    visitPrivateProperty(n) {
        var _a;
        (_a = this.handlePrivateProperty) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitPrivateProperty(n);
    }
    visitPrivateMethod(n) {
        var _a;
        (_a = this.handlePrivateMethod) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitPrivateMethod(n);
    }
    visitPrivateName(n) {
        var _a;
        (_a = this.handlePrivateName) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitPrivateName(n);
    }
    visitConstructor(n) {
        var _a;
        (_a = this.handleConstructor) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitConstructor(n);
    }
    visitConstructorParameters(nodes) {
        var _a;
        (_a = this.handleConstructorParameters) === null || _a === void 0 ? void 0 : _a.call(this, nodes);
        return super.visitConstructorParameters(nodes);
    }
    visitConstructorParameter(n) {
        var _a;
        (_a = this.handleConstructorParameter) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitConstructorParameter(n);
    }
    visitStaticBlock(n) {
        var _a;
        (_a = this.handleStaticBlock) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitStaticBlock(n);
    }
    visitTsParameterProperty(n) {
        var _a;
        (_a = this.handleTsParameterProperty) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsParameterProperty(n);
    }
    visitTsParameterPropertyParameter(n) {
        var _a;
        (_a = this.handleTsParameterPropertyParameter) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsParameterPropertyParameter(n);
    }
    visitPropertyName(key) {
        var _a;
        (_a = this.handlePropertyName) === null || _a === void 0 ? void 0 : _a.call(this, key);
        return super.visitPropertyName(key);
    }
    visitAccessibility(n) {
        var _a;
        (_a = this.handleAccessibility) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitAccessibility(n);
    }
    visitClassProperty(n) {
        var _a;
        (_a = this.handleClassProperty) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitClassProperty(n);
    }
    visitClassMethod(n) {
        var _a;
        (_a = this.handleClassMethod) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitClassMethod(n);
    }
    visitComputedPropertyKey(n) {
        var _a;
        (_a = this.handleComputedPropertyKey) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitComputedPropertyKey(n);
    }
    visitClass(n) {
        var _a;
        (_a = this.handleClass) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitClass(n);
    }
    visitFunction(n) {
        var _a;
        (_a = this.handleFunction) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitFunction(n);
    }
    visitTsExpressionsWithTypeArguments(nodes) {
        var _a;
        (_a = this.handleTsExpressionsWithTypeArguments) === null || _a === void 0 ? void 0 : _a.call(this, nodes);
        return super.visitTsExpressionsWithTypeArguments(nodes);
    }
    visitTsExpressionWithTypeArguments(n) {
        var _a;
        (_a = this.handleTsExpressionWithTypeArguments) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsExpressionWithTypeArguments(n);
    }
    visitTsTypeParameterInstantiation(n) {
        var _a;
        (_a = this.handleTsTypeParameterInstantiation) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsTypeParameterInstantiation(n);
    }
    visitTsTypes(nodes) {
        var _a;
        (_a = this.handleTsTypes) === null || _a === void 0 ? void 0 : _a.call(this, nodes);
        return super.visitTsTypes(nodes);
    }
    visitTsEntityName(n) {
        var _a;
        (_a = this.handleTsEntityName) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsEntityName(n);
    }
    visitTsQualifiedName(n) {
        var _a;
        (_a = this.handleTsQualifiedName) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsQualifiedName(n);
    }
    visitDecorators(nodes) {
        var _a;
        (_a = this.handleDecorators) === null || _a === void 0 ? void 0 : _a.call(this, nodes);
        return super.visitDecorators(nodes);
    }
    visitDecorator(n) {
        var _a;
        (_a = this.handleDecorator) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitDecorator(n);
    }
    visitExpressionStatement(stmt) {
        var _a;
        (_a = this.handleExpressionStatement) === null || _a === void 0 ? void 0 : _a.call(this, stmt);
        return super.visitExpressionStatement(stmt);
    }
    visitContinueStatement(stmt) {
        var _a;
        (_a = this.handleContinueStatement) === null || _a === void 0 ? void 0 : _a.call(this, stmt);
        return super.visitContinueStatement(stmt);
    }
    visitExpression(n) {
        var _a;
        (_a = this.handleExpression) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitExpression(n);
    }
    visitOptionalChainingExpression(n) {
        var _a;
        (_a = this.handleOptionalChainingExpression) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitOptionalChainingExpression(n);
    }
    visitMemberExpressionOrOptionalChainingCall(n) {
        var _a;
        (_a = this.handleMemberExpressionOrOptionalChainingCall) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitMemberExpressionOrOptionalChainingCall(n);
    }
    visitOptionalChainingCall(n) {
        var _a;
        (_a = this.handleOptionalChainingCall) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitOptionalChainingCall(n);
    }
    visitAssignmentExpression(n) {
        var _a;
        (_a = this.handleAssignmentExpression) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitAssignmentExpression(n);
    }
    visitPatternOrExpression(n) {
        var _a;
        (_a = this.handlePatternOrExpression) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitPatternOrExpression(n);
    }
    visitYieldExpression(n) {
        var _a;
        (_a = this.handleYieldExpression) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitYieldExpression(n);
    }
    visitUpdateExpression(n) {
        var _a;
        (_a = this.handleUpdateExpression) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitUpdateExpression(n);
    }
    visitUnaryExpression(n) {
        var _a;
        (_a = this.handleUnaryExpression) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitUnaryExpression(n);
    }
    visitTsTypeAssertion(n) {
        var _a;
        (_a = this.handleTsTypeAssertion) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsTypeAssertion(n);
    }
    visitTsConstAssertion(n) {
        var _a;
        (_a = this.handleTsConstAssertion) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsConstAssertion(n);
    }
    visitTsInstantiation(n) {
        var _a;
        (_a = this.handleTsInstantiation) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsInstantiation(n);
    }
    visitTsNonNullExpression(n) {
        var _a;
        (_a = this.handleTsNonNullExpression) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsNonNullExpression(n);
    }
    visitTsAsExpression(n) {
        var _a;
        (_a = this.handleTsAsExpression) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsAsExpression(n);
    }
    visitThisExpression(n) {
        var _a;
        (_a = this.handleThisExpression) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitThisExpression(n);
    }
    visitTemplateLiteral(n) {
        var _a;
        (_a = this.handleTemplateLiteral) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTemplateLiteral(n);
    }
    visitParameters(n) {
        var _a;
        (_a = this.handleParameters) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitParameters(n);
    }
    visitParameter(n) {
        var _a;
        (_a = this.handleParameter) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitParameter(n);
    }
    visitTaggedTemplateExpression(n) {
        var _a;
        (_a = this.handleTaggedTemplateExpression) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTaggedTemplateExpression(n);
    }
    visitSequenceExpression(n) {
        var _a;
        (_a = this.handleSequenceExpression) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitSequenceExpression(n);
    }
    visitRegExpLiteral(n) {
        var _a;
        (_a = this.handleRegExpLiteral) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitRegExpLiteral(n);
    }
    visitParenthesisExpression(n) {
        var _a;
        (_a = this.handleParenthesisExpression) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitParenthesisExpression(n);
    }
    visitObjectExpression(n) {
        var _a;
        (_a = this.handleObjectExpression) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitObjectExpression(n);
    }
    visitObjectProperties(nodes) {
        var _a;
        (_a = this.handleObjectProperties) === null || _a === void 0 ? void 0 : _a.call(this, nodes);
        return super.visitObjectProperties(nodes);
    }
    visitObjectProperty(n) {
        var _a;
        (_a = this.handleObjectProperty) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitObjectProperty(n);
    }
    visitProperty(n) {
        var _a;
        (_a = this.handleProperty) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitProperty(n);
    }
    visitSetterProperty(n) {
        var _a;
        (_a = this.handleSetterProperty) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitSetterProperty(n);
    }
    visitMethodProperty(n) {
        var _a;
        (_a = this.handleMethodProperty) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitMethodProperty(n);
    }
    visitKeyValueProperty(n) {
        var _a;
        (_a = this.handleKeyValueProperty) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitKeyValueProperty(n);
    }
    visitGetterProperty(n) {
        var _a;
        (_a = this.handleGetterProperty) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitGetterProperty(n);
    }
    visitAssignmentProperty(n) {
        var _a;
        (_a = this.handleAssignmentProperty) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitAssignmentProperty(n);
    }
    visitNullLiteral(n) {
        var _a;
        (_a = this.handleNullLiteral) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitNullLiteral(n);
    }
    visitNewExpression(n) {
        var _a;
        (_a = this.handleNewExpression) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitNewExpression(n);
    }
    visitTsTypeArguments(n) {
        var _a;
        (_a = this.handleTsTypeArguments) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsTypeArguments(n);
    }
    visitArguments(nodes) {
        var _a;
        (_a = this.handleArguments) === null || _a === void 0 ? void 0 : _a.call(this, nodes);
        return super.visitArguments(nodes);
    }
    visitArgument(n) {
        var _a;
        (_a = this.handleArgument) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitArgument(n);
    }
    visitMetaProperty(n) {
        var _a;
        (_a = this.handleMetaProperty) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitMetaProperty(n);
    }
    visitMemberExpression(n) {
        var _a;
        (_a = this.handleMemberExpression) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitMemberExpression(n);
    }
    visitSuperPropExpression(n) {
        var _a;
        (_a = this.handleSuperPropExpression) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitSuperPropExpression(n);
    }
    visitCallee(n) {
        var _a;
        (_a = this.handleCallee) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitCallee(n);
    }
    visitJSXText(n) {
        var _a;
        (_a = this.handleJSXText) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitJSXText(n);
    }
    visitJSXNamespacedName(n) {
        var _a;
        (_a = this.handleJSXNamespacedName) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitJSXNamespacedName(n);
    }
    visitJSXMemberExpression(n) {
        var _a;
        (_a = this.handleJSXMemberExpression) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitJSXMemberExpression(n);
    }
    visitJSXObject(n) {
        var _a;
        (_a = this.handleJSXObject) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitJSXObject(n);
    }
    visitJSXFragment(n) {
        var _a;
        (_a = this.handleJSXFragment) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitJSXFragment(n);
    }
    visitJSXClosingFragment(n) {
        var _a;
        (_a = this.handleJSXClosingFragment) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitJSXClosingFragment(n);
    }
    visitJSXElementChildren(nodes) {
        var _a;
        (_a = this.handleJSXElementChildren) === null || _a === void 0 ? void 0 : _a.call(this, nodes);
        return super.visitJSXElementChildren(nodes);
    }
    visitJSXElementChild(n) {
        var _a;
        (_a = this.handleJSXElementChild) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitJSXElementChild(n);
    }
    visitJSXExpressionContainer(n) {
        var _a;
        (_a = this.handleJSXExpressionContainer) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitJSXExpressionContainer(n);
    }
    visitJSXSpreadChild(n) {
        var _a;
        (_a = this.handleJSXSpreadChild) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitJSXSpreadChild(n);
    }
    visitJSXOpeningFragment(n) {
        var _a;
        (_a = this.handleJSXOpeningFragment) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitJSXOpeningFragment(n);
    }
    visitJSXEmptyExpression(n) {
        var _a;
        (_a = this.handleJSXEmptyExpression) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitJSXEmptyExpression(n);
    }
    visitJSXElement(n) {
        var _a;
        (_a = this.handleJSXElement) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitJSXElement(n);
    }
    visitJSXClosingElement(n) {
        var _a;
        (_a = this.handleJSXClosingElement) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitJSXClosingElement(n);
    }
    visitJSXElementName(n) {
        var _a;
        (_a = this.handleJSXElementName) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitJSXElementName(n);
    }
    visitJSXOpeningElement(n) {
        var _a;
        (_a = this.handleJSXOpeningElement) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitJSXOpeningElement(n);
    }
    visitJSXAttributes(attrs) {
        var _a;
        (_a = this.handleJSXAttributes) === null || _a === void 0 ? void 0 : _a.call(this, attrs);
        return super.visitJSXAttributes(attrs);
    }
    visitJSXAttributeOrSpread(n) {
        var _a;
        (_a = this.handleJSXAttributeOrSpread) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitJSXAttributeOrSpread(n);
    }
    visitJSXAttributeOrSpreads(nodes) {
        var _a;
        (_a = this.handleJSXAttributeOrSpreads) === null || _a === void 0 ? void 0 : _a.call(this, nodes);
        return super.visitJSXAttributeOrSpreads(nodes);
    }
    visitJSXAttribute(n) {
        var _a;
        (_a = this.handleJSXAttribute) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitJSXAttribute(n);
    }
    visitJSXAttributeValue(n) {
        var _a;
        (_a = this.handleJSXAttributeValue) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitJSXAttributeValue(n);
    }
    visitJSXAttributeName(n) {
        var _a;
        (_a = this.handleJSXAttributeName) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitJSXAttributeName(n);
    }
    visitConditionalExpression(n) {
        var _a;
        (_a = this.handleConditionalExpression) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitConditionalExpression(n);
    }
    visitCallExpression(n) {
        var _a;
        (_a = this.handleCallExpression) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitCallExpression(n);
    }
    visitBooleanLiteral(n) {
        var _a;
        (_a = this.handleBooleanLiteral) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitBooleanLiteral(n);
    }
    visitBinaryExpression(n) {
        var _a;
        (_a = this.handleBinaryExpression) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitBinaryExpression(n);
    }
    visitAwaitExpression(n) {
        var _a;
        (_a = this.handleAwaitExpression) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitAwaitExpression(n);
    }
    visitTsTypeParameterDeclaration(n) {
        var _a;
        (_a = this.handleTsTypeParameterDeclaration) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsTypeParameterDeclaration(n);
    }
    visitTsTypeParameters(nodes) {
        var _a;
        (_a = this.handleTsTypeParameters) === null || _a === void 0 ? void 0 : _a.call(this, nodes);
        return super.visitTsTypeParameters(nodes);
    }
    visitTsTypeParameter(n) {
        var _a;
        (_a = this.handleTsTypeParameter) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsTypeParameter(n);
    }
    visitTsTypeAnnotation(a) {
        var _a;
        (_a = this.handleTsTypeAnnotation) === null || _a === void 0 ? void 0 : _a.call(this, a);
        return super.visitTsTypeAnnotation(a);
    }
    visitTsType(n) {
        var _a;
        (_a = this.handleTsType) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitTsType(n);
    }
    visitPatterns(nodes) {
        var _a;
        (_a = this.handlePatterns) === null || _a === void 0 ? void 0 : _a.call(this, nodes);
        return super.visitPatterns(nodes);
    }
    visitImportDeclaration(n) {
        var _a;
        (_a = this.handleImportDeclaration) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitImportDeclaration(n);
    }
    visitImportSpecifiers(nodes) {
        var _a;
        (_a = this.handleImportSpecifiers) === null || _a === void 0 ? void 0 : _a.call(this, nodes);
        return super.visitImportSpecifiers(nodes);
    }
    visitImportSpecifier(node) {
        var _a;
        (_a = this.handleImportSpecifier) === null || _a === void 0 ? void 0 : _a.call(this, node);
        return super.visitImportSpecifier(node);
    }
    visitNamedImportSpecifier(node) {
        var _a;
        (_a = this.handleNamedImportSpecifier) === null || _a === void 0 ? void 0 : _a.call(this, node);
        return super.visitNamedImportSpecifier(node);
    }
    visitImportNamespaceSpecifier(node) {
        var _a;
        (_a = this.handleImportNamespaceSpecifier) === null || _a === void 0 ? void 0 : _a.call(this, node);
        return super.visitImportNamespaceSpecifier(node);
    }
    visitImportDefaultSpecifier(node) {
        var _a;
        (_a = this.handleImportDefaultSpecifier) === null || _a === void 0 ? void 0 : _a.call(this, node);
        return super.visitImportDefaultSpecifier(node);
    }
    visitBindingIdentifier(i) {
        var _a;
        (_a = this.handleBindingIdentifier) === null || _a === void 0 ? void 0 : _a.call(this, i);
        return super.visitBindingIdentifier(i);
    }
    visitIdentifierReference(i) {
        var _a;
        (_a = this.handleIdentifierReference) === null || _a === void 0 ? void 0 : _a.call(this, i);
        return super.visitIdentifierReference(i);
    }
    visitLabelIdentifier(label) {
        var _a;
        (_a = this.handleLabelIdentifier) === null || _a === void 0 ? void 0 : _a.call(this, label);
        return super.visitLabelIdentifier(label);
    }
    visitIdentifier(n) {
        var _a;
        (_a = this.handleIdentifier) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitIdentifier(n);
    }
    visitStringLiteral(n) {
        var _a;
        (_a = this.handleStringLiteral) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitStringLiteral(n);
    }
    visitNumericLiteral(n) {
        var _a;
        (_a = this.handleNumericLiteral) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitNumericLiteral(n);
    }
    visitBigIntLiteral(n) {
        var _a;
        (_a = this.handleBigIntLiteral) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitBigIntLiteral(n);
    }
    visitPattern(n) {
        var _a;
        (_a = this.handlePattern) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitPattern(n);
    }
    visitRestElement(n) {
        var _a;
        (_a = this.handleRestElement) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitRestElement(n);
    }
    visitAssignmentPattern(n) {
        var _a;
        (_a = this.handleAssignmentPattern) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitAssignmentPattern(n);
    }
    visitObjectPattern(n) {
        var _a;
        (_a = this.handleObjectPattern) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitObjectPattern(n);
    }
    visitObjectPatternProperties(nodes) {
        var _a;
        (_a = this.handleObjectPatternProperties) === null || _a === void 0 ? void 0 : _a.call(this, nodes);
        return super.visitObjectPatternProperties(nodes);
    }
    visitObjectPatternProperty(n) {
        var _a;
        (_a = this.handleObjectPatternProperty) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitObjectPatternProperty(n);
    }
    visitKeyValuePatternProperty(n) {
        var _a;
        (_a = this.handleKeyValuePatternProperty) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitKeyValuePatternProperty(n);
    }
    visitAssignmentPatternProperty(n) {
        var _a;
        (_a = this.handleAssignmentPatternProperty) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitAssignmentPatternProperty(n);
    }
    visitArrayPattern(n) {
        var _a;
        (_a = this.handleArrayPattern) === null || _a === void 0 ? void 0 : _a.call(this, n);
        return super.visitArrayPattern(n);
    }
    visitArrayPatternElements(nodes) {
        var _a;
        (_a = this.handleArrayPatternElements) === null || _a === void 0 ? void 0 : _a.call(this, nodes);
        return super.visitArrayPatternElements(nodes);
    }
    visitArrayPatternElement(m) {
        var _a;
        (_a = this.handleArrayPatternElement) === null || _a === void 0 ? void 0 : _a.call(this, m);
        return super.visitArrayPatternElement(m);
    }
}
exports.BaseVistor = BaseVistor;
function isAccessibility(n) {
    return typeof n === 'string' && ['public', 'protected', 'private'].includes(n);
}
exports.isAccessibility = isAccessibility;
function isArgument(n) {
    return typeof n === 'object' && n !== null && 'expression' in n && isExpression(n.expression);
}
exports.isArgument = isArgument;
function isArrayExpression(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ArrayExpression';
}
exports.isArrayExpression = isArrayExpression;
function isArrayPattern(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ArrayPattern';
}
exports.isArrayPattern = isArrayPattern;
function isArrowFunctionExpression(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ArrowFunctionExpression';
}
exports.isArrowFunctionExpression = isArrowFunctionExpression;
function isAssignmentExpression(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'AssignmentExpression';
}
exports.isAssignmentExpression = isAssignmentExpression;
function isAssignmentPattern(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'AssignmentPattern';
}
exports.isAssignmentPattern = isAssignmentPattern;
function isAssignmentPatternProperty(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'AssignmentPatternProperty';
}
exports.isAssignmentPatternProperty = isAssignmentPatternProperty;
function isAssignmentProperty(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'AssignmentProperty';
}
exports.isAssignmentProperty = isAssignmentProperty;
function isAwaitExpression(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'AwaitExpression';
}
exports.isAwaitExpression = isAwaitExpression;
function isBigIntLiteral(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'BigIntLiteral';
}
exports.isBigIntLiteral = isBigIntLiteral;
function isBinaryExpression(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'BinaryExpression';
}
exports.isBinaryExpression = isBinaryExpression;
function isBindingIdentifier(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'Identifier';
}
exports.isBindingIdentifier = isBindingIdentifier;
function isBlockStatement(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'BlockStatement';
}
exports.isBlockStatement = isBlockStatement;
function isBooleanLiteral(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'BooleanLiteral';
}
exports.isBooleanLiteral = isBooleanLiteral;
function isBreakStatement(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'BreakStatement';
}
exports.isBreakStatement = isBreakStatement;
function isCallExpression(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'CallExpression';
}
exports.isCallExpression = isCallExpression;
function isCatchClause(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'CatchClause';
}
exports.isCatchClause = isCatchClause;
function isClass(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'Class';
}
exports.isClass = isClass;
function isClassDeclaration(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ClassDeclaration';
}
exports.isClassDeclaration = isClassDeclaration;
function isClassExpression(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ClassExpression';
}
exports.isClassExpression = isClassExpression;
function isClassMember(n) {
    return isConstructor(n) || isClassMethod(n) || isPrivateMethod(n) || isClassProperty(n) || isPrivateProperty(n) || isTsIndexSignature(n) || isEmptyStatement(n) || isStaticBlock(n);
}
exports.isClassMember = isClassMember;
function isClassMethod(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ClassMethod';
}
exports.isClassMethod = isClassMethod;
function isClassProperty(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ClassProperty';
}
exports.isClassProperty = isClassProperty;
function isComputedPropName(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ComputedPropName';
}
exports.isComputedPropName = isComputedPropName;
function isConditionalExpression(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ConditionalExpression';
}
exports.isConditionalExpression = isConditionalExpression;
function isConstructor(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'Constructor';
}
exports.isConstructor = isConstructor;
function isContinueStatement(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ContinueStatement';
}
exports.isContinueStatement = isContinueStatement;
function isDebuggerStatement(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'DebuggerStatement';
}
exports.isDebuggerStatement = isDebuggerStatement;
function isDeclaration(n) {
    return (isClassDeclaration(n) || isFunctionDeclaration(n) || isVariableDeclaration(n) || isTsInterfaceDeclaration(n) || isTsTypeAliasDeclaration(n) || isTsEnumDeclaration(n) || isTsModuleDeclaration(n));
}
exports.isDeclaration = isDeclaration;
function isDecorator(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'Decorator';
}
exports.isDecorator = isDecorator;
function isDefaultDecl(n) {
    return isClassExpression(n) || isFunctionExpression(n) || isTsInterfaceDeclaration(n);
}
exports.isDefaultDecl = isDefaultDecl;
function isDoWhileStatement(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'DoWhileStatement';
}
exports.isDoWhileStatement = isDoWhileStatement;
function isEmptyStatement(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'EmptyStatement';
}
exports.isEmptyStatement = isEmptyStatement;
function isExportAllDeclaration(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ExportAllDeclaration';
}
exports.isExportAllDeclaration = isExportAllDeclaration;
function isExportDeclaration(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ExportDeclaration';
}
exports.isExportDeclaration = isExportDeclaration;
function isExportDefaultDeclaration(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ExportDefaultDeclaration';
}
exports.isExportDefaultDeclaration = isExportDefaultDeclaration;
function isExportDefaultExpression(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ExportDefaultExpression';
}
exports.isExportDefaultExpression = isExportDefaultExpression;
function isExportDefaultSpecifier(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ExportDefaultSpecifier';
}
exports.isExportDefaultSpecifier = isExportDefaultSpecifier;
function isExportNamedDeclaration(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ExportNamedDeclaration';
}
exports.isExportNamedDeclaration = isExportNamedDeclaration;
function isExportNamespaceSpecifier(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ExportNamespaceSpecifier';
}
exports.isExportNamespaceSpecifier = isExportNamespaceSpecifier;
function isExportSpecifier(n) {
    return isExportNamespaceSpecifier(n) || isExportDefaultSpecifier(n) || isNamedExportSpecifier(n);
}
exports.isExportSpecifier = isExportSpecifier;
function isExprOrSpread(n) {
    return typeof n === 'object' && n !== null && 'expression' in n && isExpression(n.expression);
}
exports.isExprOrSpread = isExprOrSpread;
function isExpression(n) {
    return (isThisExpression(n) ||
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
        isInvalid(n));
}
exports.isExpression = isExpression;
function isExpressionStatement(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ExpressionStatement';
}
exports.isExpressionStatement = isExpressionStatement;
function isForInStatement(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ForInStatement';
}
exports.isForInStatement = isForInStatement;
function isForOfStatement(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ForOfStatement';
}
exports.isForOfStatement = isForOfStatement;
function isForStatement(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ForStatement';
}
exports.isForStatement = isForStatement;
function isFunctionDeclaration(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'FunctionDeclaration';
}
exports.isFunctionDeclaration = isFunctionDeclaration;
function isFunctionExpression(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'FunctionExpression';
}
exports.isFunctionExpression = isFunctionExpression;
function isGetterProperty(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'GetterProperty';
}
exports.isGetterProperty = isGetterProperty;
function isIdentifier(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'Identifier';
}
exports.isIdentifier = isIdentifier;
function isIfStatement(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'IfStatement';
}
exports.isIfStatement = isIfStatement;
function isImport(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'Import';
}
exports.isImport = isImport;
function isImportDeclaration(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ImportDeclaration';
}
exports.isImportDeclaration = isImportDeclaration;
function isImportDefaultSpecifier(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ImportDefaultSpecifier';
}
exports.isImportDefaultSpecifier = isImportDefaultSpecifier;
function isImportNamespaceSpecifier(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ImportNamespaceSpecifier';
}
exports.isImportNamespaceSpecifier = isImportNamespaceSpecifier;
function isImportSpecifier(n) {
    return isNamedExportSpecifier(n) || isImportDefaultSpecifier(n) || isImportNamespaceSpecifier(n);
}
exports.isImportSpecifier = isImportSpecifier;
function isLiteral(n) {
    return isStringLiteral(n) || isBooleanLiteral(n) || isNullLiteral(n) || isNumericLiteral(n) || isBigIntLiteral(n) || isRegExpLiteral(n) || isJSXText(n);
}
exports.isLiteral = isLiteral;
function isJSXAttrValue(n) {
    return isLiteral(n) || isJSXExpressionContainer(n) || isJSXElement(n) || isJSXFragment(n);
}
exports.isJSXAttrValue = isJSXAttrValue;
function isJSXAttribute(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'JSXAttribute';
}
exports.isJSXAttribute = isJSXAttribute;
function isJSXAttributeName(n) {
    return isIdentifier(n) || isJSXNamespacedName(n);
}
exports.isJSXAttributeName = isJSXAttributeName;
function isJSXAttributeOrSpread(n) {
    return isJSXAttribute(n) || isSpreadElement(n);
}
exports.isJSXAttributeOrSpread = isJSXAttributeOrSpread;
function isJSXClosingElement(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'JSXClosingElement';
}
exports.isJSXClosingElement = isJSXClosingElement;
function isJSXClosingFragment(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'JSXClosingFragment';
}
exports.isJSXClosingFragment = isJSXClosingFragment;
function isJSXElement(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'JSXElement';
}
exports.isJSXElement = isJSXElement;
function isJSXElementChild(n) {
    return isJSXText(n) || isJSXExpressionContainer(n) || isJSXSpreadChild(n) || isJSXElement(n) || isJSXFragment(n);
}
exports.isJSXElementChild = isJSXElementChild;
function isJSXElementName(n) {
    return isIdentifier(n) || isJSXMemberExpression(n) || isJSXNamespacedName(n);
}
exports.isJSXElementName = isJSXElementName;
function isJSXEmptyExpression(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'JSXEmptyExpression';
}
exports.isJSXEmptyExpression = isJSXEmptyExpression;
function isJSXExpressionContainer(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'JSXExpressionContainer';
}
exports.isJSXExpressionContainer = isJSXExpressionContainer;
function isJSXFragment(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'JSXFragment';
}
exports.isJSXFragment = isJSXFragment;
function isJSXMemberExpression(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'JSXMemberExpression';
}
exports.isJSXMemberExpression = isJSXMemberExpression;
function isJSXNamespacedName(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'JSXNamespacedName';
}
exports.isJSXNamespacedName = isJSXNamespacedName;
function isJSXObject(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'JSXObject';
}
exports.isJSXObject = isJSXObject;
function isJSXOpeningElement(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'JSXOpeningElement';
}
exports.isJSXOpeningElement = isJSXOpeningElement;
function isJSXOpeningFragment(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'JSXOpeningFragment';
}
exports.isJSXOpeningFragment = isJSXOpeningFragment;
function isJSXSpreadChild(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'JSXSpreadChild';
}
exports.isJSXSpreadChild = isJSXSpreadChild;
function isJSXText(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'JSXText';
}
exports.isJSXText = isJSXText;
function isKeyValuePatternProperty(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'KeyValuePatternProperty';
}
exports.isKeyValuePatternProperty = isKeyValuePatternProperty;
function isKeyValueProperty(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'KeyValueProperty';
}
exports.isKeyValueProperty = isKeyValueProperty;
function isLabeledStatement(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'LabeledStatement';
}
exports.isLabeledStatement = isLabeledStatement;
function isMemberExpression(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'MemberExpression';
}
exports.isMemberExpression = isMemberExpression;
function isMetaProperty(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'MetaProperty';
}
exports.isMetaProperty = isMetaProperty;
function isMethodProperty(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'MethodProperty';
}
exports.isMethodProperty = isMethodProperty;
function isModule(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'Module';
}
exports.isModule = isModule;
function isModuleDeclaration(n) {
    return (isImportDeclaration(n) ||
        isExportDeclaration(n) ||
        isExportNamedDeclaration(n) ||
        isExportDefaultDeclaration(n) ||
        isExportDefaultExpression(n) ||
        isExportAllDeclaration(n) ||
        isTsImportEqualsDeclaration(n) ||
        isTsExportAssignment(n) ||
        isTsNamespaceExportDeclaration(n));
}
exports.isModuleDeclaration = isModuleDeclaration;
function isModuleExportName(n) {
    return isIdentifier(n) || isStringLiteral(n);
}
exports.isModuleExportName = isModuleExportName;
function isModuleItem(n) {
    return isModuleDeclaration(n) || isStatement(n);
}
exports.isModuleItem = isModuleItem;
function isNamedExportSpecifier(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'NamedExportSpecifier';
}
exports.isNamedExportSpecifier = isNamedExportSpecifier;
function isNamedImportSpecifier(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'NamedImportSpecifier';
}
exports.isNamedImportSpecifier = isNamedImportSpecifier;
function isNewExpression(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'NewExpression';
}
exports.isNewExpression = isNewExpression;
function isNullLiteral(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'NullLiteral';
}
exports.isNullLiteral = isNullLiteral;
function isNumericLiteral(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'NumericLiteral';
}
exports.isNumericLiteral = isNumericLiteral;
function isObjectExpression(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ObjectExpression';
}
exports.isObjectExpression = isObjectExpression;
function isObjectPattern(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ObjectPattern';
}
exports.isObjectPattern = isObjectPattern;
function isObjectPatternProperty(n) {
    return isKeyValuePatternProperty(n) || isAssignmentPatternProperty(n) || isRestElement(n);
}
exports.isObjectPatternProperty = isObjectPatternProperty;
function isOptionalChainingCall(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'CallExpression';
}
exports.isOptionalChainingCall = isOptionalChainingCall;
function isOptionalChainingExpression(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'OptionalChainingExpression';
}
exports.isOptionalChainingExpression = isOptionalChainingExpression;
function isParam(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'Param';
}
exports.isParam = isParam;
function isParenthesisExpression(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ParenthesisExpression';
}
exports.isParenthesisExpression = isParenthesisExpression;
function isInvalid(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'Invalid';
}
exports.isInvalid = isInvalid;
function isPattern(n) {
    return isBindingIdentifier(n) || isArrayPattern(n) || isRestElement(n) || isObjectPattern(n) || isAssignmentPattern(n) || isInvalid(n) || isExpression(n);
}
exports.isPattern = isPattern;
function isPrivateMethod(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'PrivateMethod';
}
exports.isPrivateMethod = isPrivateMethod;
function isPrivateName(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'PrivateName';
}
exports.isPrivateName = isPrivateName;
function isPrivateProperty(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'PrivateProperty';
}
exports.isPrivateProperty = isPrivateProperty;
function isProgram(n) {
    return isModule(n) || isScript(n);
}
exports.isProgram = isProgram;
function isProperty(n) {
    return isIdentifier(n) || isKeyValueProperty(n) || isAssignmentProperty(n) || isGetterProperty(n) || isSetterProperty(n) || isMethodProperty(n);
}
exports.isProperty = isProperty;
function isPropertyName(n) {
    return isIdentifier(n) || isStringLiteral(n) || isNumericLiteral(n) || isComputedPropName(n) || isBigIntLiteral(n);
}
exports.isPropertyName = isPropertyName;
function isRegExpLiteral(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'RegExpLiteral';
}
exports.isRegExpLiteral = isRegExpLiteral;
function isRestElement(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'RestElement';
}
exports.isRestElement = isRestElement;
function isReturnStatement(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ReturnStatement';
}
exports.isReturnStatement = isReturnStatement;
function isScript(n) {
    return isNode(n) && isHasSpan(n) && 'interpreter' in n && n.type === 'Script';
}
exports.isScript = isScript;
function isSequenceExpression(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'SequenceExpression';
}
exports.isSequenceExpression = isSequenceExpression;
function isSetterProperty(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'SetterProperty';
}
exports.isSetterProperty = isSetterProperty;
function isSpreadElement(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'SpreadElement';
}
exports.isSpreadElement = isSpreadElement;
function isStatement(n) {
    return (isBlockStatement(n) ||
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
        isExpressionStatement(n));
}
exports.isStatement = isStatement;
function isStaticBlock(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'StaticBlock';
}
exports.isStaticBlock = isStaticBlock;
function isStringLiteral(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'StringLiteral';
}
exports.isStringLiteral = isStringLiteral;
function isSuper(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'Super';
}
exports.isSuper = isSuper;
function isSuperPropExpression(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'SuperPropExpression';
}
exports.isSuperPropExpression = isSuperPropExpression;
function isSwitchCase(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'SwitchCase';
}
exports.isSwitchCase = isSwitchCase;
function isSwitchStatement(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'SwitchStatement';
}
exports.isSwitchStatement = isSwitchStatement;
function isTaggedTemplateExpression(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TaggedTemplateExpression';
}
exports.isTaggedTemplateExpression = isTaggedTemplateExpression;
function isTemplateLiteral(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TemplateLiteral';
}
exports.isTemplateLiteral = isTemplateLiteral;
function isThisExpression(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ThisExpression';
}
exports.isThisExpression = isThisExpression;
function isThrowStatement(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ThrowStatement';
}
exports.isThrowStatement = isThrowStatement;
function isTryStatement(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TryStatement';
}
exports.isTryStatement = isTryStatement;
function isTsAsExpression(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsAsExpression';
}
exports.isTsAsExpression = isTsAsExpression;
function isTsCallSignatureDeclaration(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsCallSignatureDeclaration';
}
exports.isTsCallSignatureDeclaration = isTsCallSignatureDeclaration;
function isTsConstAssertion(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsConstAssertion';
}
exports.isTsConstAssertion = isTsConstAssertion;
function isTsConstructSignatureDeclaration(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsConstructSignatureDeclaration';
}
exports.isTsConstructSignatureDeclaration = isTsConstructSignatureDeclaration;
function isTsEnumDeclaration(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsEnumDeclaration';
}
exports.isTsEnumDeclaration = isTsEnumDeclaration;
function isTsEnumMember(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsEnumMember';
}
exports.isTsEnumMember = isTsEnumMember;
function isTsEnumMemberId(n) {
    return isIdentifier(n) || isStringLiteral(n);
}
exports.isTsEnumMemberId = isTsEnumMemberId;
function isTsExportAssignment(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsExportAssignment';
}
exports.isTsExportAssignment = isTsExportAssignment;
function isTsExpressionWithTypeArguments(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsExpressionWithTypeArguments';
}
exports.isTsExpressionWithTypeArguments = isTsExpressionWithTypeArguments;
function isTsExternalModuleReference(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsExternalModuleReference';
}
exports.isTsExternalModuleReference = isTsExternalModuleReference;
function isObjectPatter(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'ObjectPattern';
}
exports.isObjectPatter = isObjectPatter;
function isTsFnParameter(n) {
    return isBindingIdentifier(n) || isArrayPattern(n) || isRestElement(n) || isObjectPatter(n);
}
exports.isTsFnParameter = isTsFnParameter;
function isTsGetterSignature(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsGetterSignature';
}
exports.isTsGetterSignature = isTsGetterSignature;
function isTsImportEqualsDeclaration(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsImportEqualsDeclaration';
}
exports.isTsImportEqualsDeclaration = isTsImportEqualsDeclaration;
function isTsIndexSignature(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsIndexSignature';
}
exports.isTsIndexSignature = isTsIndexSignature;
function isTsInstantiation(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsInstantiation';
}
exports.isTsInstantiation = isTsInstantiation;
function isTsInterfaceBody(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsInterfaceBody';
}
exports.isTsInterfaceBody = isTsInterfaceBody;
function isTsInterfaceDeclaration(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsInterfaceDeclaration';
}
exports.isTsInterfaceDeclaration = isTsInterfaceDeclaration;
function isTsMethodSignature(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsMethodSignature';
}
exports.isTsMethodSignature = isTsMethodSignature;
function isTsModuleBlock(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsModuleBlock';
}
exports.isTsModuleBlock = isTsModuleBlock;
function isTsModuleDeclaration(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsModuleDeclaration';
}
exports.isTsModuleDeclaration = isTsModuleDeclaration;
function isTsModuleName(n) {
    return isIdentifier(n) || isStringLiteral(n);
}
exports.isTsModuleName = isTsModuleName;
function isTsEntityName(n) {
    return isTsQualifiedName(n) || isIdentifier(n);
}
exports.isTsEntityName = isTsEntityName;
function isTsModuleReference(n) {
    return isTsEntityName(n) || isTsExternalModuleReference(n);
}
exports.isTsModuleReference = isTsModuleReference;
function isTsNamespaceBody(n) {
    return isTsModuleBlock(n) || isTsNamespaceDeclaration(n);
}
exports.isTsNamespaceBody = isTsNamespaceBody;
function isTsNamespaceDeclaration(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsNamespaceDeclaration';
}
exports.isTsNamespaceDeclaration = isTsNamespaceDeclaration;
function isTsNamespaceExportDeclaration(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsNamespaceExportDeclaration';
}
exports.isTsNamespaceExportDeclaration = isTsNamespaceExportDeclaration;
function isTsNonNullExpression(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsNonNullExpression';
}
exports.isTsNonNullExpression = isTsNonNullExpression;
function isTsParameterProperty(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsParameterProperty';
}
exports.isTsParameterProperty = isTsParameterProperty;
function isTsParameterPropertyParameter(n) {
    return isBindingIdentifier(n) || isAssignmentPattern(n);
}
exports.isTsParameterPropertyParameter = isTsParameterPropertyParameter;
function isTsPropertySignature(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsPropertySignature';
}
exports.isTsPropertySignature = isTsPropertySignature;
function isTsQualifiedName(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsQualifiedName';
}
exports.isTsQualifiedName = isTsQualifiedName;
function isTsSetterSignature(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsSetterSignature';
}
exports.isTsSetterSignature = isTsSetterSignature;
function isTsKeywordType(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsKeywordType';
}
exports.isTsKeywordType = isTsKeywordType;
function isTsThisType(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsThisType';
}
exports.isTsThisType = isTsThisType;
function isTsFunctionType(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsFunctionType';
}
exports.isTsFunctionType = isTsFunctionType;
function isTsConstructorType(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsConstructorType';
}
exports.isTsConstructorType = isTsConstructorType;
function isTsFnOrConstructorType(n) {
    return isTsFunctionType(n) || isTsConstructorType(n);
}
exports.isTsFnOrConstructorType = isTsFnOrConstructorType;
function isTsTypeReference(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsTypeReference';
}
exports.isTsTypeReference = isTsTypeReference;
function isTsTypeQuery(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsTypeQuery';
}
exports.isTsTypeQuery = isTsTypeQuery;
function isTsTypeLiteral(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsTypeLiteral';
}
exports.isTsTypeLiteral = isTsTypeLiteral;
function isTsArrayType(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsArrayType';
}
exports.isTsArrayType = isTsArrayType;
function isTsTupleType(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsTupleType';
}
exports.isTsTupleType = isTsTupleType;
function isTsOptionalType(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsOptionalType';
}
exports.isTsOptionalType = isTsOptionalType;
function isTsRestType(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsRestType';
}
exports.isTsRestType = isTsRestType;
function isTsUnionType(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsUnionType';
}
exports.isTsUnionType = isTsUnionType;
function isTsIntersectionType(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsIntersectionType';
}
exports.isTsIntersectionType = isTsIntersectionType;
function isTsUnionOrIntersectionType(n) {
    return isTsUnionType(n) || isTsIntersectionType(n);
}
exports.isTsUnionOrIntersectionType = isTsUnionOrIntersectionType;
function isTsConditionalType(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsConditionalType';
}
exports.isTsConditionalType = isTsConditionalType;
function isTsInferType(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsInferType';
}
exports.isTsInferType = isTsInferType;
function isTsParenthesizedType(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsParenthesizedType';
}
exports.isTsParenthesizedType = isTsParenthesizedType;
function isTsTypeOperator(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsTypeOperator';
}
exports.isTsTypeOperator = isTsTypeOperator;
function isTsIndexedAccessType(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsIndexedAccessType';
}
exports.isTsIndexedAccessType = isTsIndexedAccessType;
function isTsMappedType(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsMappedType';
}
exports.isTsMappedType = isTsMappedType;
function isTsLiteralType(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsLiteralType';
}
exports.isTsLiteralType = isTsLiteralType;
function isTsTypePredicate(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsTypePredicate';
}
exports.isTsTypePredicate = isTsTypePredicate;
function isTsImportType(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsImportType';
}
exports.isTsImportType = isTsImportType;
function isTsType(n) {
    return (isTsKeywordType(n) ||
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
        isTsImportType(n));
}
exports.isTsType = isTsType;
function isTsTypeAliasDeclaration(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsTypeAliasDeclaration';
}
exports.isTsTypeAliasDeclaration = isTsTypeAliasDeclaration;
function isTsTypeAnnotation(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsTypeAnnotation';
}
exports.isTsTypeAnnotation = isTsTypeAnnotation;
function isTsTypeAssertion(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsTypeAssertion';
}
exports.isTsTypeAssertion = isTsTypeAssertion;
function isTsTypeElement(n) {
    return (isTsCallSignatureDeclaration(n) ||
        isTsConstructSignatureDeclaration(n) ||
        isTsPropertySignature(n) ||
        isTsGetterSignature(n) ||
        isTsSetterSignature(n) ||
        isTsMethodSignature(n) ||
        isTsIndexSignature(n));
}
exports.isTsTypeElement = isTsTypeElement;
function isTsTypeParameter(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsTypeParameter';
}
exports.isTsTypeParameter = isTsTypeParameter;
function isTsTypeParameterDeclaration(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsTypeParameterDeclaration';
}
exports.isTsTypeParameterDeclaration = isTsTypeParameterDeclaration;
function isTsTypeParameterInstantiation(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'TsTypeParameterInstantiation';
}
exports.isTsTypeParameterInstantiation = isTsTypeParameterInstantiation;
function isUnaryExpression(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'UnaryExpression';
}
exports.isUnaryExpression = isUnaryExpression;
function isUpdateExpression(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'UpdateExpression';
}
exports.isUpdateExpression = isUpdateExpression;
function isVariableDeclaration(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'VariableDeclaration';
}
exports.isVariableDeclaration = isVariableDeclaration;
function isVariableDeclarator(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'VariableDeclarator';
}
exports.isVariableDeclarator = isVariableDeclarator;
function isWhileStatement(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'WhileStatement';
}
exports.isWhileStatement = isWhileStatement;
function isWithStatement(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'WithStatement';
}
exports.isWithStatement = isWithStatement;
function isYieldExpression(n) {
    return isNode(n) && isHasSpan(n) && n.type === 'YieldExpression';
}
exports.isYieldExpression = isYieldExpression;
//# sourceMappingURL=Visitor.js.map