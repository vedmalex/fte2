import { parseSync, VariableDeclarator, Identifier, ArrayExpression, ObjectExpression, ReturnStatement, CallExpression, MemberExpression, BinaryExpression, FunctionDeclaration, UnaryExpression, StringLiteral, NewExpression } from '@swc/core'
import { Visitor } from '@swc/core/Visitor.js'
import fs from 'node:fs'
import path from 'node:path'
import { globSync } from 'glob'
import { processUnusedAndGlobalVariables } from './ident'

export type TypeInferConfig = {
  cwd?: string
  allowed: Array<string>
  notallowed?: Array<string>
  ignore?: Array<string>
  include?: Array<string>
  knownGlobals?: Array<string>
  applyJsdoc?: boolean
  globalsFile?: string
  exportFunctions?: Array<string>
  reportFile?: string
}

export type InferredType = string

type VarInfo = {
  names: Set<string>
  inferred: Set<InferredType>
  objectShape?: Record<string, InferredType>
}

export type FunctionInfo = {
  name?: string
  params: Record<string, Set<InferredType>>
  returns: Set<InferredType>
  spanStart: number
}

function listFiles(config: Pick<TypeInferConfig, 'cwd' | 'allowed' | 'notallowed' | 'ignore' | 'include'>) {
  const search = config.include?.map(
    ig => `${ig}.@(${config.allowed.join('|')})`,
  ) ?? [`**/*.@(${config.allowed.join('|')})`]
  const ignore = [
    ...(config.notallowed
      ? config.include?.map(
          ig => `${ig}.@(${config.notallowed?.join('|')})`,
        ) ?? [`**/*.@(${config.notallowed?.join('|')})`]
      : []),
    ...(config.ignore ?? []),
  ]
  const files: Array<string> = []
  search.forEach(pattern => {
    const list = globSync(pattern, { cwd: config.cwd ?? './', ignore })
    files.push(...list.map(f => path.join(config.cwd ?? './', f)))
  })
  return files
}

function prim(t: string): InferredType { return t }

function mergeTypes(types: Set<InferredType>): InferredType {
  if (types.size === 0) return 'any'
  const arr = [...types]
  const uniq = Array.from(new Set(arr))
  return uniq.join(' | ')
}

function arrayOf(elem: InferredType): InferredType {
  if (!elem.includes('|') && !elem.includes(',')) return `${elem}[]`
  return `Array<${elem}>`
}

function objectOf(shape: Record<string, InferredType>): InferredType {
  const entries = Object.entries(shape).map(([k, v]) => `${JSON.stringify(k)}: ${v}`)
  return `{ ${entries.join('; ')} }`
}

class InferVisitor extends Visitor {
  constructor(
    private varTypes: Map<string, VarInfo>,
    private funcStack: FunctionInfo[],
    public functionsByName: Map<string, FunctionInfo>,
  ) { super() }

  private recordVar(name: string, t: InferredType) {
    if (!this.varTypes.has(name)) this.varTypes.set(name, { names: new Set([name]), inferred: new Set() })
    this.varTypes.get(name)!.inferred.add(t)
  }

  override visitTsType(n: any): any { return n }
  override visitTsTypeAnnotation(n: any): any { return n }

  private recordParamIfMatches(identName: string, t: InferredType) {
    const top = this.funcStack[this.funcStack.length - 1]
    if (!top) return
    if (!top.params[identName]) return
    top.params[identName].add(t)
  }

  private inferExpr(expr: any): InferredType {
    if (!expr) return 'any'
    switch (expr.type) {
      case 'StringLiteral': return prim('string')
      case 'NumericLiteral': return prim('number')
      case 'BooleanLiteral': return prim('boolean')
      case 'NullLiteral': return prim('null')
      case 'RegExpLiteral': return prim('RegExp')
      case 'NewExpression': {
        const ne = expr as NewExpression
        if ((ne.callee as any)?.type === 'Identifier') {
          return (ne.callee as any).value
        }
        return 'any'
      }
      case 'ArrayExpression': {
        const elems = (expr as ArrayExpression).elements?.map(e => e?.expression && this.inferExpr(e.expression)).filter(Boolean) as string[]
        const elemType = mergeTypes(new Set(elems.length ? elems : ['any']))
        return arrayOf(elemType)
      }
      case 'ObjectExpression': {
        const shape: Record<string, InferredType> = {}
        for (const p of (expr as ObjectExpression).properties) {
          if (p.type === 'KeyValueProperty' && p.key.type === 'Identifier') {
            shape[p.key.value] = this.inferExpr(p.value as any)
          }
        }
        return objectOf(shape)
      }
      case 'ArrowFunctionExpression':
      case 'FunctionExpression':
      case 'FunctionDeclaration':
        return 'Function'
      case 'CallExpression': {
        const ce = expr as CallExpression
        if (ce.callee.type === 'MemberExpression' && (ce.callee.property as any).type === 'Identifier' && (ce.callee.property as any).value === 'then') {
          return 'Promise<any>'
        }
        if (ce.callee.type === 'Identifier') {
          const n = (ce.callee as any).value
          if (n === 'String') return 'string'
          if (n === 'Number') return 'number'
          if (n === 'Boolean') return 'boolean'
        }
        return 'any'
      }
      case 'Identifier': return 'any'
      case 'BinaryExpression': {
        const be = expr as BinaryExpression
        const op = be.operator
        if (['+', '-', '*', '/', '%', '**', '|', '&', '^', '<<', '>>', '>>>'].includes(op)) return 'number'
        if (op === '||' || op === '??' || op === '&&') {
          const lt = this.inferExpr((be as any).left)
          const rt = this.inferExpr((be as any).right)
          return mergeTypes(new Set([lt, rt]))
        }
        return 'any'
      }
      default:
        return 'any'
    }
  }

  override visitVariableDeclarator(n: VariableDeclarator) {
    const init: any = (n as any).init
    const id: any = (n as any).id
    if (id?.type === 'Identifier') {
      const name = id.value
      if (init) {
        const t = this.inferExpr(init)
        this.recordVar(name, t)
        if (init.type === 'ObjectExpression') {
          const shape: Record<string, InferredType> = {}
          for (const p of (init as ObjectExpression).properties) {
            if (p.type === 'KeyValueProperty' && p.key.type === 'Identifier') {
              shape[p.key.value] = this.inferExpr(p.value as any)
            }
          }
          if (!this.varTypes.has(name)) this.varTypes.set(name, { names: new Set([name]), inferred: new Set() })
          const info = this.varTypes.get(name)!
          info.objectShape = { ...(info.objectShape ?? {}), ...shape }
          info.inferred.add(objectOf(info.objectShape))
        }
        if (init.type === 'FunctionExpression' || init.type === 'ArrowFunctionExpression') {
          if (!this.functionsByName.has(name)) this.functionsByName.set(name, { name, params: {}, returns: new Set(), spanStart: (n as any).span?.start ?? 0 })
          const finfo = this.functionsByName.get(name)!
          const params = (init.params ?? [])
          for (const p of params) {
            const pat: any = p
            if (pat?.type === 'Identifier') finfo.params[pat.value] = finfo.params[pat.value] || new Set<InferredType>()
            else if (pat?.pat?.type === 'Identifier') finfo.params[pat.pat.value] = finfo.params[pat.pat.value] || new Set<InferredType>()
          }
          if (init.type === 'ArrowFunctionExpression' && init.body && init.body.type !== 'BlockStatement') {
            finfo.returns.add(this.inferExpr(init.body))
          }
        }
      }
    }
    return super.visitVariableDeclarator(n)
  }

  override visitBinaryExpression(n: BinaryExpression): any {
    const be: any = n
    const l = be.left, r = be.right
    if (be.operator === '+') {
      if (l?.type === 'StringLiteral' || r?.type === 'StringLiteral') {
        if (l?.type === 'Identifier') { this.recordVar(l.value, 'string'); this.recordParamIfMatches(l.value, 'string') }
        if (r?.type === 'Identifier') { this.recordVar(r.value, 'string'); this.recordParamIfMatches(r.value, 'string') }
      } else {
        if (l?.type === 'Identifier') { this.recordVar(l.value, 'number'); this.recordParamIfMatches(l.value, 'number') }
        if (r?.type === 'Identifier') { this.recordVar(r.value, 'number'); this.recordParamIfMatches(r.value, 'number') }
      }
    } else if (['-', '*', '/', '%', '**', '|', '&', '^', '<<', '>>', '>>>'].includes(be.operator)) {
      if (l?.type === 'Identifier') { this.recordVar(l.value, 'number'); this.recordParamIfMatches(l.value, 'number') }
      if (r?.type === 'Identifier') { this.recordVar(r.value, 'number'); this.recordParamIfMatches(r.value, 'number') }
    } else if (be.operator === 'instanceof') {
      if (l?.type === 'Identifier' && r?.type === 'Identifier') {
        const typeName = r.value
        this.recordVar(l.value, typeName)
        this.recordParamIfMatches(l.value, typeName)
      }
    } else if (be.operator === 'in') {
      if (r?.type === 'Identifier') this.recordVar(r.value, 'Record<string, any>')
    } else if (be.operator === '===') {
      const leftIsTypeof = l?.type === 'UnaryExpression' && (l as UnaryExpression).operator === 'typeof'
      const rightIsString = r?.type === 'StringLiteral'
      const rightIsTypeof = r?.type === 'UnaryExpression' && (r as UnaryExpression).operator === 'typeof'
      const leftIsString = l?.type === 'StringLiteral'
      const mapTypeof = (s: string): InferredType => {
        switch (s) {
          case 'string': return 'string'
          case 'number': return 'number'
          case 'boolean': return 'boolean'
          case 'undefined': return 'undefined'
          case 'object': return 'Record<string, any>'
          case 'function': return 'Function'
          case 'bigint': return 'bigint'
          case 'symbol': return 'symbol'
          default: return 'any'
        }
      }
      if (leftIsTypeof && rightIsString) {
        const arg: any = (l as UnaryExpression).argument
        if (arg?.type === 'Identifier') {
          const t = mapTypeof((r as StringLiteral).value)
          this.recordVar(arg.value, t)
          this.recordParamIfMatches(arg.value, t)
        }
      } else if (rightIsTypeof && leftIsString) {
        const arg: any = (r as UnaryExpression).argument
        if (arg?.type === 'Identifier') {
          const t = mapTypeof((l as StringLiteral).value)
          this.recordVar(arg.value, t)
          this.recordParamIfMatches(arg.value, t)
        }
      }
    }
    return super.visitBinaryExpression(n)
  }

  override visitMemberExpression(n: MemberExpression): any {
    const me: any = n
    if (me.object?.type === 'Identifier') {
      const name = me.object.value
      if (me.computed) {
        const idx = me.property
        if (idx?.type === 'NumericLiteral') {
          this.recordVar(name, arrayOf('any'))
        }
      } else {
        this.recordVar(name, 'Record<string, any>')
      }
    }
    return super.visitMemberExpression(n)
  }

  override visitAssignmentExpression(n: any): any {
    const asn = n as any
    const left = asn.left
    const right = asn.right
    if (left?.type === 'MemberExpression' && left.object?.type === 'Identifier') {
      const objName = left.object.value
      const prop = left.property
      if (!left.computed && prop?.type === 'Identifier') {
        const t = this.inferExpr(right as any)
        if (!this.varTypes.has(objName)) this.varTypes.set(objName, { names: new Set([objName]), inferred: new Set() })
        const info = this.varTypes.get(objName)!
        info.objectShape = { ...(info.objectShape ?? {}), [prop.value]: t }
        info.inferred.add(objectOf(info.objectShape))
      } else if (left.computed && prop?.type === 'NumericLiteral') {
        const t = this.inferExpr(right as any)
        this.recordVar(objName, arrayOf(t))
      }
    }
    return super.visitAssignmentExpression(n)
  }

  override visitCallExpression(n: CallExpression): any {
    const ce: any = n
    if (ce.callee?.type === 'MemberExpression') {
      const obj = ce.callee.object
      const prop = ce.callee.property
      if (obj?.type === 'Identifier' && prop?.type === 'Identifier') {
        if (prop.value === 'push' && ce.arguments?.[0]) {
          this.recordVar(obj.value, arrayOf(this.inferExpr(ce.arguments[0].expression)))
        }
        if (obj?.type === 'Identifier' && obj.value === 'Array' && prop.value === 'isArray' && ce.arguments?.[0]) {
          const arg = ce.arguments[0]
          const ex = arg.expression ?? arg
          if (ex?.type === 'Identifier') {
            this.recordVar(ex.value, arrayOf('any'))
            this.recordParamIfMatches(ex.value, arrayOf('any'))
          }
        }
        if (obj?.type === 'Identifier' && obj.value === 'Object' && prop.value === 'assign' && ce.arguments?.length) {
          const [target, ...sources] = ce.arguments
          const targ = (target as any).expression ?? target
          if (targ?.type === 'Identifier') {
            const tname = targ.value
            let shape: Record<string, InferredType> = {}
            for (const s of sources) {
              const se = (s as any).expression ?? s
              if (se?.type === 'ObjectExpression') {
                for (const p of (se as ObjectExpression).properties) {
                  if (p.type === 'KeyValueProperty' && p.key.type === 'Identifier') {
                    shape[p.key.value] = this.inferExpr(p.value as any)
                  }
                }
              }
            }
            if (Object.keys(shape).length) {
              if (!this.varTypes.has(tname)) this.varTypes.set(tname, { names: new Set([tname]), inferred: new Set() })
              const info = this.varTypes.get(tname)!
              info.objectShape = { ...(info.objectShape ?? {}), ...shape }
              info.inferred.add(objectOf(info.objectShape))
            }
          }
        }
      }
    }
    if (ce.callee?.type === 'Identifier') {
      const fnName = ce.callee.value
      if (!this.functionsByName.has(fnName)) this.functionsByName.set(fnName, { name: fnName, params: {}, returns: new Set(), spanStart: 0 })
      const finfo = this.functionsByName.get(fnName)!
      ce.arguments?.forEach((arg: any, idx: number) => {
        const t = this.inferExpr(arg.expression ?? arg)
        const pname = Object.keys(finfo.params)[idx]
        if (pname) {
          finfo.params[pname].add(t)
        } else {
          const synthetic = `arg${idx}`
          finfo.params[synthetic] = finfo.params[synthetic] || new Set<InferredType>()
          finfo.params[synthetic].add(t)
        }
      })
    }
    return super.visitCallExpression(n)
  }

  override visitFunctionDeclaration(n: FunctionDeclaration): any {
    const finfo: FunctionInfo = { name: n.identifier?.value, params: {}, returns: new Set(), spanStart: n.span.start }
    ;(n.params || []).forEach((p, idx) => {
      const pat: any = p.pat
      if (pat?.type === 'Identifier') finfo.params[pat.value] = finfo.params[pat.value] || new Set<InferredType>()
      else {
        const syn = `arg${idx}`
        finfo.params[syn] = finfo.params[syn] || new Set<InferredType>()
      }
    })
    if (finfo.name && !this.functionsByName.has(finfo.name)) this.functionsByName.set(finfo.name, finfo)
    this.funcStack.push(finfo)
    if (n.body) this.visitBlockStatement(n.body)
    this.funcStack.pop()
    return n
  }

  override visitReturnStatement(n: ReturnStatement): any {
    const top = this.funcStack[this.funcStack.length - 1]
    if (top && n.argument) {
      top.returns.add(this.inferExpr(n.argument as any))
    }
    return super.visitReturnStatement(n)
  }
}

export function inferTypesInFiles(config: TypeInferConfig) {
  const files = listFiles(config)
  const globalsAgg = new Map<string, VarInfo>()
  const funcsByFile = new Map<string, FunctionInfo[]>()
  const report: any = { files: {} as Record<string, any>, globals: {} as Record<string, any> }

  for (const file of files) {
    const source = fs.readFileSync(file).toString()
    const program = parseSync(source, { syntax: file.match(/.ts?$/) ? 'typescript' : 'ecmascript', tsx: file.endsWith('.tsx') })

    const varTypes = new Map<string, VarInfo>()
    const funcStack: FunctionInfo[] = []
    const functionsByName = new Map<string, FunctionInfo>()
    const v = new InferVisitor(varTypes, funcStack, functionsByName)
    v.visitProgram(program)

    const { globalVariables } = processUnusedAndGlobalVariables(program, { knownGlobals: config.knownGlobals })
    for (const name of globalVariables.keys()) {
      const info = varTypes.get(name) ?? { names: new Set([name]), inferred: new Set<InferredType>(['any']) }
      if (!globalsAgg.has(name)) globalsAgg.set(name, { names: new Set([name]), inferred: new Set<InferredType>() })
      const gi = globalsAgg.get(name)!
      info.inferred.forEach(t => gi.inferred.add(t))
      if (info.objectShape) {
        gi.objectShape = { ...(gi.objectShape ?? {}), ...info.objectShape }
        gi.inferred.add(objectOf(gi.objectShape))
      }
    }

    funcsByFile.set(file, Array.from(functionsByName.values()))

    if (config.exportFunctions && config.exportFunctions.length > 0) {
      let updatedSource = source
      const decls: FunctionDeclaration[] = []
      program.body.forEach((stmt: any) => { if (stmt.type === 'FunctionDeclaration') decls.push(stmt as FunctionDeclaration) })
      const sorted = decls.sort((a, b) => b.span.start - a.span.start)
      for (const fn of sorted) {
        const name = fn.identifier?.value
        if (!name) continue
        if (!config.exportFunctions.includes(name)) continue
        const srcStart = fn.span.start - program.span.start
        let lineStart = updatedSource.lastIndexOf('\n', srcStart - 1) + 1
        while (lineStart > 0) {
          const nextLineStart = updatedSource.lastIndexOf('\n', lineStart - 2) + 1
          const seg = updatedSource.slice(nextLineStart, lineStart)
          if (/^\s*\/\/.|^\s*\/*/.test(seg)) {
            lineStart = nextLineStart
          } else {
            break
          }
        }
        const before = updatedSource.slice(lineStart, srcStart)
        if (/^\s*export\b/.test(before)) continue
        updatedSource = updatedSource.slice(0, lineStart) + 'export ' + updatedSource.slice(lineStart)
      }
      if (updatedSource !== source) {
        fs.writeFileSync(file, updatedSource)
      }
    }

    const isTS = file.endsWith('.ts') || file.endsWith('.tsx')
    const dtsPath = file.replace(/\.(tsx|ts|jsx|js)$/i, '.d.ts')
    const fnLines: string[] = []
    const fileFuncs = funcsByFile.get(file) || []
    const funcNames = new Set(fileFuncs.filter(f => f.name).map(f => f.name as string))
    for (const finfo of fileFuncs) {
      const name = finfo.name
      if (!name) continue
      const exportIt = !!config.exportFunctions?.includes(name)
      const genForTS = true
      if (!isTS || genForTS) {
        const paramNames = Object.keys(finfo.params)
        const paramsText = paramNames.map(pn => `${pn}: ${mergeTypes(finfo.params[pn] ?? new Set<InferredType>(['any']))}`).join(', ')
        const retType = mergeTypes(finfo.returns ?? new Set<InferredType>(['any'])) || 'any'
        fnLines.push(`${exportIt ? 'export ' : 'declare '}function ${name}(${paramsText}): ${retType};`)
      }
    }
    for (const [vname, vinfo] of (varTypes as Map<string, VarInfo>).entries()) {
      if (funcNames.has(vname)) continue
      const vtype = vinfo.objectShape ? objectOf(vinfo.objectShape) : mergeTypes(vinfo.inferred)
      const finalType = vtype || 'any'
      fnLines.push(`declare const ${vname}: ${finalType};`)
    }
    if (fnLines.length > 0) fs.writeFileSync(dtsPath, fnLines.join('\n') + '\n')

    report.files[file] = {
      functions: (funcsByFile.get(file) || []).map(f => ({ name: f.name, params: Object.fromEntries(Object.entries(f.params).map(([k, v]) => [k, Array.from(v)])), returns: Array.from(f.returns) })),
      variables: Array.from(varTypes.entries()).map(([name, info]) => ({ name, type: info.objectShape ? objectOf(info.objectShape) : mergeTypes(info.inferred) })),
    }
  }

  const lines: string[] = []
  for (const [name, info] of globalsAgg.entries()) {
    const typeStr = info.objectShape ? objectOf(info.objectShape) : mergeTypes(info.inferred)
    const finalType = typeStr || 'any'
    lines.push(`declare const ${name}: ${finalType};`)
    report.globals[name] = finalType
  }
  const out = (config.globalsFile ?? 'globals.d.ts')
  fs.writeFileSync(out, lines.join('\n') + (lines.length ? '\n' : ''))

  if (config.applyJsdoc) {
    for (const file of files) {
      const isTS = file.endsWith('.ts') || file.endsWith('.tsx')
      const source = fs.readFileSync(file).toString()
      const program = parseSync(source, { syntax: isTS ? 'typescript' : 'ecmascript', tsx: file.endsWith('.tsx') })
      const funcDecls: { name: string, start: number, hasTypes: boolean, params: string[], returns: string }[] = []
      program.body.forEach((stmt: any) => {
        if (stmt.type === 'FunctionDeclaration') {
          const name = stmt.identifier?.value || ''
          let hasTypes = false
          if (isTS) {
            const hasAnyParam = (stmt.params || []).some((p: any) => p.pat?.typeAnnotation ? (p.pat.typeAnnotation.typeAnnotation.type !== 'TsAnyKeyword') : false)
            const hasRet = !!stmt.returnType
            hasTypes = hasAnyParam && hasRet
          }
          const finfos = funcsByFile.get(file) || []
          const fI = finfos.find(f => f.name === name)
          const params = fI ? Object.keys(fI.params).map(pn => `${pn}: ${mergeTypes(fI.params[pn]) || 'any'}`) : []
          const returns = fI ? (mergeTypes(fI.returns) || 'any') : 'any'
          funcDecls.push({ name, start: stmt.span.start, hasTypes, params, returns })
        }
      })
      program.body.forEach((stmt: any) => {
        if (stmt.type === 'VariableDeclaration') {
          (stmt.declarations || []).forEach((d: any) => {
            if (d.id?.type === 'Identifier' && d.init && (d.init.type === 'FunctionExpression' || d.init.type === 'ArrowFunctionExpression')) {
              const name = d.id.value
              const finfos = funcsByFile.get(file) || []
              const fI = finfos.find(f => f.name === name)
              const params = fI ? Object.keys(fI.params).map(pn => `${pn}: ${mergeTypes(fI.params[pn]) || 'any'}`) : []
              const returns = fI ? (mergeTypes(fI.returns) || 'any') : 'any'
              funcDecls.push({ name, start: d.span.start, hasTypes: false, params, returns })
            }
          })
        }
      })
      if (funcDecls.length === 0) continue

      let augmented = source
      const sorted = funcDecls.sort((a, b) => b.start - a.start)
      for (const fn of sorted) {
        const before = augmented.slice(Math.max(0, fn.start - program.span.start - 4), fn.start - program.span.start)
        const alreadyHas = before.includes('/**')
        const shouldAnnotate = !alreadyHas
        if (!shouldAnnotate) continue
        const paramsLines = fn.params.map(p => ` * @param ${p}`).join('\n')
        const retLine = ` * @returns ${fn.returns}`
        const jsdoc = `/**\n * @function ${fn.name}\n${paramsLines ? paramsLines + '\n' : ''}${retLine}\n */\n`
        const insertPos = fn.start - program.span.start
        augmented = augmented.slice(0, insertPos) + jsdoc + augmented.slice(insertPos)
      }
      if (augmented !== source) fs.writeFileSync(file, augmented)
    }
  }

  if (config.reportFile) {
    const json = JSON.stringify(report, null, 2)
    fs.writeFileSync(config.reportFile, json)
  }

  return { globalsFile: out, report }
}

// Lightweight inference directly from a source string (no filesystem IO)
export function inferTypesInSource(source: string, knownGlobals: string[] = []): {
  variables: Record<string, InferredType>
} {
  try {
    const program = parseSync(source, { syntax: 'ecmascript' })
    const varTypes = new Map<string, VarInfo>()
    const funcStack: FunctionInfo[] = []
    const functionsByName = new Map<string, FunctionInfo>()
    const v = new InferVisitor(varTypes, funcStack, functionsByName)
    v.visitProgram(program)
    // Merge with globals detection to only include unresolved identifiers
    const { globalVariables } = require('./ident').processUnusedAndGlobalVariables(program, { knownGlobals })
    const result: Record<string, InferredType> = {}
    for (const name of globalVariables.keys()) {
      const info = varTypes.get(name)
      const t = info?.objectShape ? objectOf(info.objectShape) : mergeTypes(info?.inferred ?? new Set<InferredType>())
      result[name] = t || 'any'
    }
    return { variables: result }
  } catch {
    return { variables: {} }
  }
}
