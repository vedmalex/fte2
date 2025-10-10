import {
  type ArrowFunctionExpression,
  type CallExpression,
  type ClassDeclaration,
  type FunctionDeclaration,
  type Identifier,
  type KeyValueProperty,
  type MemberExpression,
  type ObjectExpression,
  type Param,
  parseSync,
  type TsType,
  type VariableDeclarator,
} from '@swc/core'
import { Visitor } from '@swc/core/Visitor.js'

function register(identifier, array: Map<string, number>) {
  switch (identifier.type) {
    case 'Identifier':
      if (!array.has(identifier.value)) {
        return array.set(identifier.value, 1)
      } else {
        const count = array.get(identifier.value)!
        return array.set(identifier.value, count + 1)
      }
    case 'KeyValuePatternProperty':
      return register(identifier.value, array)
    case 'RestElement':
      return register(identifier.argument, array)
    case 'AssignmentPatternProperty':
      if (!array.has(identifier.key.value)) {
        return array.set(identifier.key.value, 1)
      } else {
        const count = array.get(identifier.key.value)!
        return array.set(identifier.key.value, count + 1)
      }
    case 'ObjectPattern':
      return identifier.properties.forEach((x) => register(x, array))
    case 'ArrayPattern':
      return identifier.elements.forEach((x) => register(x, array))
  }
}

export type IdentOptions = {
  knownGlobals?: Array<string>
}

export function findUnusedAndGlobalVariables(code, options?: IdentOptions) {
  const ast = parseSync(code, { syntax: 'typescript' })
  return processUnusedAndGlobalVariables(ast, options)
}

export function processUnusedAndGlobalVariables(code, options?: IdentOptions) {
  const referencedVariables = new Map<string, number>()
  const globalVariables = new Map<string, number>()
  const declaredVariables = new Map<string, number>()
  const knownGlobals = new Set<string>([
    'Object',
    ...(options?.knownGlobals ?? []),
  ])

  function registerReference(path) {
    if (path) {
      register(path, referencedVariables)
    }
  }

  function registerDeclaration(path) {
    if (path) {
      register(path, declaredVariables)
    }
  }

  function registerGlobal(path) {
    if (path) {
      // Skip known globals
      if (path.type === 'Identifier' && knownGlobals.has(path.value)) return
      register(path, globalVariables)
    }
  }

  class DeclarationVisitor extends Visitor {
    override visitTsType(n: TsType): TsType {
      if (n.type === 'TsTypeReference') {
        registerGlobal(n.typeName)
      }
      return n
    }

    override visitFunctionDeclaration(decl: FunctionDeclaration) {
      registerDeclaration(decl.identifier)
      decl.params.forEach((p) => registerDeclaration(p.pat))
      return super.visitFunctionDeclaration(decl)
    }

    override visitClassDeclaration(decl: ClassDeclaration) {
      registerDeclaration(decl.identifier)
      decl.body.forEach((member) => {
        if (
          member.type === 'ClassProperty' &&
          member.key.type === 'Identifier'
        ) {
          registerDeclaration(member.key)
        }
      })
      return super.visitClassDeclaration(decl)
    }

    override visitVariableDeclarator(path: VariableDeclarator) {
      registerDeclaration(path.id)
      return super.visitVariableDeclarator(path)
    }

    override visitArrowFunctionExpression(e: ArrowFunctionExpression) {
      e.params.forEach((p) => registerDeclaration(p))
      return super.visitArrowFunctionExpression(e)
    }

    override visitParameter(n: Param) {
      registerDeclaration(n.pat)
      return super.visitParameter(n)
    }

    override visitKeyValueProperty(n: KeyValueProperty) {
      if (n.value.type === 'FunctionExpression' && n.value.body) {
        this.visitBlockStatement(n.value.body)
      }
      return n
    }
  }

  class ReferenceVisitor extends Visitor {
    override visitVariableDeclarator(path: VariableDeclarator) {
      const init = (path as any).init
      if (init) this.visitExpression(init as any)
      return path
    }

    override visitFunctionDeclaration(decl: FunctionDeclaration) {
      if (decl.body) this.visitBlockStatement(decl.body)
      return decl
    }

    override visitClassDeclaration(decl: ClassDeclaration) {
      return decl
    }

    override visitParameter(n: Param) {
      return n
    }
    override visitTsType(n: TsType): TsType {
      if (n.type === 'TsTypeReference') {
        registerGlobal(n.typeName)
      }
      return n
    }

    override visitCallExpression(n: CallExpression) {
      if (n.callee.type === 'Identifier') {
        registerReference(n.callee)
      } else if (n.callee.type === 'MemberExpression') {
        this.visitMemberExpression(n.callee)
      }
      n.arguments.forEach((arg) => {
        if (arg.expression.type === 'Identifier') {
          registerReference(arg.expression)
        }
      })
      return super.visitCallExpression(n)
    }

    override visitIdentifier(path: Identifier) {
      if (!declaredVariables.has(path.value)) {
        registerGlobal(path)
      }
      registerReference(path)
      return path
    }

    override visitMemberExpression(member: MemberExpression) {
      if (member.object.type === 'Identifier') {
        if (
          member.object.value === 'global' ||
          member.object.value === 'globalThis'
        ) {
          if (member.property.type === 'Identifier') {
            registerGlobal(member.property)
          }
        } else {
          registerReference(member.object)
          if (
            !declaredVariables.has(member.object.value) &&
            member.object.value !== 'Object'
          ) {
            registerGlobal(member.object)
          }
        }
      } else if (member.object.type === 'MemberExpression') {
        this.visitMemberExpression(member.object)
      }

      if ((member as any).computed) {
        if (member.property.type === 'Identifier') {
          registerReference(member.property)
        } else {
          return super.visitMemberExpression(member)
        }
        return member
      }

      return member
    }

    override visitObjectExpression(n: ObjectExpression) {
      n.properties.forEach((prop) => {
        if (prop.type === 'KeyValueProperty') {
          this.visitKeyValueProperty(prop)
        }
      })
      return super.visitObjectExpression(n)
    }

    override visitKeyValueProperty(n: KeyValueProperty) {
      if (n.key.type === 'Computed' && n.key.expression.type === 'Identifier') {
        registerReference(n.key.expression)
      }
      if (n.value.type === 'Identifier') {
        registerReference(n.value)
      } else if (n.value.type === 'FunctionExpression') {
        if (n.value.body) {
          this.visitBlockStatement(n.value.body)
        }
      } else if (n.value.type === 'ObjectExpression') {
        n.value.properties.forEach((prop) => {
          if (prop.type === 'KeyValueProperty') this.visitKeyValueProperty(prop)
        })
      }
      return n
    }
  }

  const declarationVisitor = new DeclarationVisitor()
  declarationVisitor.visitProgram(code)

  const referenceVisitor = new ReferenceVisitor()
  referenceVisitor.visitProgram(code)

  const unusedVariables = new Set<string>()

  declaredVariables.forEach((_, key) => {
    if (!referencedVariables.has(key)) {
      unusedVariables.add(key)
    }
  })

  globalVariables.forEach((_, key) => {
    if (declaredVariables.has(key)) {
      globalVariables.delete(key)
    }
  })

  return {
    unusedVariables,
    globalVariables,
    referencedVariables,
    declaredVariables,
  }
}
