import detectIndent from 'detect-indent'
import type {
  SourceLocation,
  SourceMapOptions,
} from 'fte.js-base'

export type StateDefinition = {
  start?: Array<string>
  end?: Array<string>
  skip?: {
    start?: Array<string>
    end?: Array<string>
  }
  states?: Array<ResultTypes>
  curly?: 0 | 1 | 2
  type?: { [key: string]: ResultTypes }
}
/**
 <% 'Scriptlet' tag, for control-flow, no output
 <%_ 'Whitespace Slurping' Scriptlet tag, strips all whitespace before it
 <%= Outputs the value into the template (HTML escaped)
 <%- Outputs the unescaped value into the template
 <%# Comment tag, no execution, no output

 <%% Outputs a literal '<%'
 %> Plain ending tag
 removes/cleans whitespases after
 -%> Trim-mode ('newline slurp') tag, trims following newline
 _%> 'Whitespace Slurping' ending tag, removes all whitespace after it
 */
export type ResultTypes =
  | 'unknown'
  | 'expression'
  | 'uexpression'
  | 'expression2'
  | 'uexpression2'
  | 'code'
  | 'directive'
  | 'comments'
  | 'slotStart'
  | 'blockStart'
  | 'blockEnd'
  | 'text'
  | 'skip'
  | 'empty'

export type SystemBlocksType =
  | 'directive'
  | 'comments'
  | 'slotStart'
  | 'blockStart'
  | 'blockEnd'
  | 'code'
  | null

const globalStates: { [key: string]: StateDefinition } = {
  /*
  has chunks
  has slots
  has blocks
  has ?? все что угодно можно получить просто анализируя соответствующий контент, и выставлять значения в соответствующий блок
  в некоторых директивах не будет нужны
  можно автоматически определять, просто анализируя текст
  */
  text: {
    // обратный порядок для ускорения цикла
    states: [
      'unknown',
      'expression',
      'uexpression',
      'code',
      'directive',
      'slotStart',
      'blockStart',
      'blockEnd',
      'comments',
    ],
  },
  unknown: {
    start: ['<%', '<%=', '<%-', '<%_', '<%#'],
    end: ['%>', '-%>', '_%>'],
    skip: {
      start: ['<%%'],
      end: ['%%>'],
    },
    type: {
      '<%': 'code',
      '<%=': 'uexpression',
      '<%-': 'expression',
      '<%#': 'comments',
      '<%_': 'code',
    },
  },
  expression: {
    start: ['#{'],
    end: ['}'],
    curly: 1,
  },
  uexpression: {
    start: ['!{'],
    end: ['}'],
    curly: 1,
  },
  code: {
    start: ['<#', '<#-'],
    end: ['#>', '-#>'],
    skip: {
      start: ['<#@', '<# block', '<# slot', '<# end #>', '<#{'],
    },
  },
  directive: {
    start: ['<#@'],
    end: ['#>', '-#>'],
  },
  comments: {
    start: ['<*'],
    end: ['*>'],
  },
  blockStart: {
    start: ['<# block', '<#- block'],
    end: [': #>', ': -#>'],
  },
  slotStart: {
    start: ['<# slot', '<#- slot'],
    end: [': #>', ': -#>'],
  },
  blockEnd: {
    start: ['<# end #>', '<#- end #>', '<# end -#>', '<#- end -#>'],
  },
}
export default globalStates

export interface ParserResult {
  data: string
  pos: number
  line: number
  column: number
  type: ResultTypes
  start: string
  end: string
  eol: boolean
  sourceFile?: string
  originalStart?: SourceLocation
  originalEnd?: SourceLocation
  sourceContent?: string
}

export interface Items {
  content: string
  indent?: string
  pos: number
  line: number
  column: number
  start: string
  end: string
  eol: boolean
  type: ResultTypes
  sourceFile?: string
  originalStart?: SourceLocation
  originalEnd?: SourceLocation
  sourceContent?: string
}

export type RequireItem = {
  name: string
  alias: string
}

const directives = [
  'extend',
  'context',
  'alias',
  'deindent',
  'chunks',
  'includeMainChunk',
  'useHash',
  'noContent',
  'noSlots',
  'noBlocks',
  'noPartial',
  'noOptions',
  'promise',
  'callback',
  'requireAs',
]

function detectDirective(input: string) {
  let name
  let params
  if (input) {
    input = input.trim()
    for (let i = 0; i < directives.length; i += 1) {
      const directive = directives[i]
      if (SUB(input.trim(), directive) == directive) {
        name = directive
        params = UNPARAM(input.slice(directive.length))
        break
      }
    }
  }
  return {
    name: name ? name : input,
    params,
  }
}

export class CodeBlockDirectives {
  extend!: string
  deindent!: number | boolean
  context = 'context'
  alias!: Array<string>
  chunks!: string
  includeMainChunk!: boolean
  useHash!: boolean
  content = true
  slots = true
  blocks = true
  partial = true
  options = true
  // return promise
  promise!: boolean
  // return callback
  callback!: boolean
  requireAs: Array<RequireItem> = []
  push(init: ParserResult) {
    const { name, params } = detectDirective(init.data.trim())
    switch (name) {
      case 'deindent':
        this.deindent = params.length > 0 ? Number.parseInt(params[0]) : true
        break
      case 'extend':
        this.extend = params[0]
        break
      case 'context':
        this.context = params[0]
        break
      case 'alias':
        this.alias = params
        break
      case 'chunks':
        this.chunks = params[0]
        break
      case 'includeMainChunk':
        this.includeMainChunk = true
        break
      case 'useHash':
        this.useHash = true
        break
      case 'noContent':
        this.content = false
        break
      case 'noSlots':
        this.slots = false
        break
      case 'noBlocks':
        this.blocks = false
        break
      case 'noPartial':
        this.partial = false
        break
      case 'noOptions':
        this.options = false
        break
      case 'promise':
        this.promise = true
        break
      case 'callback':
        this.callback = true
        break
      case 'requireAs':
        this.requireAs.push({ name: params[0], alias: params[1] })
        break
      default:
      // console.log('unknown directive: ' + name)
    }
  }
}

export class CodeBlock {
  name!: string
  main: Array<Items> = []
  // сделать все необходимые проверки для более чистого кода
  //
  directives: CodeBlockDirectives = new CodeBlockDirectives()
  documentation: Array<Items> = []
  slots: { [slot: string]: CodeBlock } = {}
  blocks: { [block: string]: CodeBlock } = {}
  constructor(init?: ParserResult) {
    if (init) {
      this.name = UNQUOTE(init.data)
    }
  }
  addBlock(block: CodeBlock) {
    this.directives.blocks = true
    this.blocks[block.name] = block
  }
  addSlot(slot: CodeBlock) {
    this.directives.slots = true
    this.blocks[slot.name] = slot
  }
}

const UNQUOTE = (str?: string) => {
  if (str) {
    let res = str.trim()
    res = res.match(/['"`]([^`'"].*)[`'"]/)?.[1] ?? res
    return res
  } else {
    return ''
  }
}

const UNPARAM = (str?: string) => {
  if (str) {
    let res = str?.trim()
    res = res.match(/\(?([^)].*\))/)?.[1] ?? res
    return res.split(',').map(UNQUOTE)
  } else {
    return []
  }
}

export interface ParserOptions {
  indent?: string | number
  sourceMap?: boolean
  sourceFile?: string
  sourceContent?: string
  sourceRoot?: string
}

export class Parser {
  private buffer: string
  private size: number
  public INDENT!: number
  private static INITIAL_STATE: ResultTypes = 'text'
  private static DEFAULT_TAB_SIZE = 2
  private globalState: ResultTypes
  private actualState?: ResultTypes | null
  private globalToken!: ParserResult
  private pos = 0
  private line = 1
  private column = 1
  private curlyAware: 0 | 1 | 2 | undefined = 0
  private curlyBalance: Array<number> = []
  private result: Array<ParserResult> = []

  private sourceFile?: string
  private sourceContent?: string
  private sourceRoot?: string
  private sourceMapEnabled = false

  public static parse(text: string | Buffer, options: ParserOptions = {}) {
    const parser = new Parser(
      typeof text == 'string' ? text : text.toString(),
      options,
    )
    parser.parse()
    return parser.process()
  }

  private constructor(value: string, options: ParserOptions) {
    if (options.indent) {
      this.INDENT =
        typeof options.indent === 'string'
          ? options.indent.length
          : options.indent
    }

    this.sourceMapEnabled = options.sourceMap ?? false
    this.sourceFile = options.sourceFile
    this.sourceContent = options.sourceContent
    this.sourceRoot = options.sourceRoot

    this.globalState = Parser.INITIAL_STATE
    this.buffer = value.toString()
    this.size = this.buffer.length
  }

  collect() {
    const { term, eol } = this.SYMBOL()
    if (eol) {
      this.globalToken.eol = true
      this.term()
    } else {
      this.globalToken.data += term
    }
  }

  private run(currentState: ResultTypes) {
    const init_pos = this.pos
    const state = globalStates[currentState]
    this.curlyAware = state.curly
    if (state.start) {
      if (state.skip?.start) {
        for (let i = 0; i < state.skip.start.length; i += 1) {
          if (this.SUB(state.skip.start[i]) == state.skip.start[i]) {
            // process as string
            return false
          }
        }
      }
      //has start
      let foundStart = false
      let foundEnd = false
      for (let i = state.start.length - 1; i >= 0; i -= 1) {
        const p = state.start[i]
        const subs = this.SUB(p).toLowerCase()
        if (subs == p) {
          foundStart = true
          this.globalState = currentState
          this.actualState = state.type?.[p] ?? currentState
          this.term({ start: p })
          this.SKIP(p)
          break
        }
      }
      if (foundStart)
        do {
          if (state.end) {
            let i
            for (i = state.end.length - 1; i >= 0; i -= 1) {
              const p = state.end[i]
              if (state.curly == 1 && p.indexOf('}') > -1) {
                if (this.curlyBalance.length > 0) {
                  break
                }
              }
              if (state.curly == 2 && p.indexOf('}}') > -1) {
                if (this.curlyBalance.length > 0) {
                  break
                }
              }
              const subs = this.SUB(p).toLowerCase()
              if (subs == p) {
                this.SKIP(p)
                foundEnd = true
                break
              }
            }
            if (!foundEnd) {
              this.collect()
            } else {
              this.globalToken.end = state.end[i]
              this.actualState = null
            }
          } else {
            foundEnd = true
          }
        } while (!foundEnd && this.pos < this.size)
    }

    // has only states
    else if (state.states) {
      let found = false
      for (let i = state.states.length - 1; i >= 0; i -= 1) {
        const name = state.states[i]
        found = this.run(name)
        if (found) {
          this.globalState = currentState
          this.actualState = null
          this.term()
          break
        }
      }
      if (!found) {
        this.collect()
      }
    }
    return init_pos != this.pos
  }

  private parse() {
    if (this.size > 0) {
      this.term()
      do {
        this.run(this.globalState)
      } while (this.pos < this.size)
      this.term()
    }
  }

  private process() {
    const content = new CodeBlock()
    const resultSize = this.result.length
    let curr = content
    let data = ''
    let pos = 0
    let line = 1
    let column = 1
    let start = ''
    let end = ''
    let eol = false
    let type: ResultTypes = 'unknown'

    const updateSourceMap = (item: Items) => {
      if (this.sourceMapEnabled && item.sourceFile && item.originalStart) {
        item.originalEnd = {
          source: item.sourceFile,
          line: this.line,
          column: this.column,
        }
      }
    }

    for (let i = 0; i < resultSize; i += 1) {
      const r = this.result[i]
      data = r.data
      pos = r.pos
      line = r.line
      column = r.column
      start = r.start
      end = r.end
      eol = r.eol
      type = r.type

      const trimStartSpases = () => {
        data = data.replace(/^\s+/, '')
      }

      const trimEndSpaces = () => {
        data = data.replace(/\s+$/, '')
      }

      const trimStartLines = () => {
        data = data.replace(/^[\r\n]+/, '')
      }

      const trimEndLines = (count = 0) => {
        if (count > 0) {
          const lines = data.match(/[\r\n]/g)
          if (lines && lines.length > count) {
            data = data.replace(/[\r\n]+$/, '')
          }
        } else {
          data = data.replace(/[\r\n]+$/, '')
        }
      }

      switch (type) {
        case 'directive':
          trimStartLines()
          trimEndLines()
          curr.directives.push(r)
          break
        case 'blockStart':
          trimStartLines()
          trimEndLines()
          curr = new CodeBlock(r)
          content.addBlock(curr)
          break
        case 'slotStart':
          trimStartLines()
          trimEndLines()
          curr = new CodeBlock(r)
          content.addSlot(curr)
          break
        case 'blockEnd':
          trimStartLines()
          curr = content
          trimEndLines()
          break
        case 'unknown': {
          let actual_type: ResultTypes = 'unknown'
          switch (start) {
            case '<%':
              actual_type = 'code'
              break
            case '<%_':
              actual_type = 'code'
              trimStartSpases()
              break
            case '<%-':
              actual_type = 'expression'
              break
            case '<%=':
              actual_type = 'uexpression'
              break
            case '<%#':
              actual_type = 'comments'
              break
          }
          switch (end) {
            case '-%>':
              trimEndLines(1)
              break
            case '_%>':
              trimEndSpaces()
              break
          }
          if (actual_type !== 'comments') {
            const item: Items = {
              content: data,
              pos,
              line,
              column,
              start,
              end,
              type: actual_type,
              eol,
              sourceFile: r.sourceFile,
              originalStart: r.originalStart,
              sourceContent: r.sourceContent,
            }
            updateSourceMap(item)
            curr.main.push(item)
          } else {
            const item: Items = {
              content: data,
              pos,
              line,
              column,
              start,
              end,
              type: actual_type,
              eol,
              sourceFile: r.sourceFile,
              originalStart: r.originalStart,
              sourceContent: r.sourceContent,
            }
            updateSourceMap(item)
            curr.documentation.push(item)
          }
          break
        }
        case 'code': {
          if (start === '<%_') {
            trimStartSpases()
          }
          if (end === '_%>') {
            trimEndSpaces()
          }
          if (end === '-#>') {
            trimEndLines()
          }
          const codeItem: Items = {
            content: data,
            pos,
            line,
            column,
            start,
            end,
            type,
            eol,
            sourceFile: r.sourceFile,
            originalStart: r.originalStart,
            sourceContent: r.sourceContent,
          }
          updateSourceMap(codeItem)
          curr.main.push(codeItem)
          break
        }
        case 'expression':
        case 'expression2':
          {
            const expressionItem: Items = {
              content: data,
              pos,
              line,
              column,
              start,
              end,
              type: 'expression',
              eol,
              sourceFile: r.sourceFile,
              originalStart: r.originalStart,
              sourceContent: r.sourceContent,
            }
            updateSourceMap(expressionItem)
            curr.main.push(expressionItem)
          }
          break
        case 'uexpression':
        case 'uexpression2':
          {
            const uexpressionItem: Items = {
              content: data,
              pos,
              line,
              column,
              start,
              end,
              type: 'uexpression',
              eol,
              sourceFile: r.sourceFile,
              originalStart: r.originalStart,
              sourceContent: r.sourceContent,
            }
            updateSourceMap(uexpressionItem)
            const prev = curr.main.pop()
            if (prev) {
              if (prev.type !== 'text' || (prev.type === 'text' && prev.eol)) {
                curr.main.push(prev)
              } else {
                uexpressionItem.indent = prev.content
              }
            }
            curr.main.push(uexpressionItem)
          }
          break
        case 'text': {
          const actualType: ResultTypes = data || eol ? type : 'empty'
          if (
            actualType === 'empty' &&
            curr.main.length > 0 &&
            curr.main[curr.main.length - 1].type === 'empty'
          ) {
            break
          }
          const textItem: Items = {
            content: data,
            pos,
            line,
            column,
            start,
            end,
            type: actualType,
            eol,
            sourceFile: r.sourceFile,
            originalStart: r.originalStart,
            sourceContent: r.sourceContent,
          }
          updateSourceMap(textItem)
          curr.main.push(textItem)
          break
        }
        case 'comments': {
          trimStartLines()
          trimEndLines()
          const commentItem: Items = {
            content: data,
            pos,
            line,
            column,
            start,
            end,
            type,
            eol,
            sourceFile: r.sourceFile,
            originalStart: r.originalStart,
            sourceContent: r.sourceContent,
          }
          updateSourceMap(commentItem)
          curr.documentation.push(commentItem)
          break
        }
      }
    }
    return content
  }

  private SYMBOL() {
    const res = this.buffer[this.pos]
    if (this.curlyAware == 1) {
      if (~res.indexOf('{')) {
        this.curlyBalance.push(this.pos)
      } else if (~res.indexOf('}')) {
        this.curlyBalance.pop()
      }
    }
    if (this.curlyAware == 2) {
      if (~res.indexOf('{{')) {
        this.curlyBalance.push(this.pos)
      } else if (~res.indexOf('}}')) {
        this.curlyBalance.pop()
      }
    }
    // can return more than one char as autoocorrection of endof lines
    return this.SKIP(res)
  }
  private DETECT_INDENT() {
    const { buffer } = this
    const indent = detectIndent(buffer).indent
    if (~indent.indexOf('\t')) {
      this.INDENT = Parser.DEFAULT_TAB_SIZE
    } else {
      this.INDENT = indent.length
    }
  }
  private SKIP(term: string) {
    const { INDENT } = this
    let eol = false
    if (term.length == 1) {
      if (
        term == '\n' ||
        term == '\r' ||
        term == '\u2028' ||
        term == '\u2029'
      ) {
        if (term == '\r' && this.SUB('\r\n') == '\r\n') {
          term = '\r\n'
        }
        this.column = 1
        this.line += 1
        eol = true
      } else if (term == '\t') {
        if (!INDENT) this.DETECT_INDENT()
        this.column += this.INDENT
      } else {
        this.column += 1
      }
      this.pos += term.length
    } else {
      // каждое вхождение нужно разобрать
      // имитируем посимвольную передачу
      const startPos = this.pos
      let nTerm = ''
      do {
        // может переходить больше чем на 1 символ
        nTerm += this.SKIP(this.buffer[this.pos])
      } while (this.pos < startPos + term.length)
      term = nTerm
    }

    return { term, eol }
  }
  private block(extra: Partial<ParserResult> = {}): ParserResult {
    const {
      pos,
      line,
      column,
      globalState,
      actualState,
      sourceFile,
      sourceMapEnabled,
    } = this
    const result: ParserResult = {
      data: '',
      pos,
      line,
      column,
      type: actualState || globalState,
      start: '',
      end: '',
      eol: false,
      ...extra,
    }

    // Добавляем информацию для source maps если они включены
    if (sourceMapEnabled && sourceFile) {
      result.sourceFile = sourceFile
      result.sourceContent = this.sourceContent
      result.originalStart = {
        source: sourceFile,
        line,
        column,
      }
      // originalEnd будет установлен позже, когда мы будем знать конечную позицию
    }

    return result
  }
  private SUB(str) {
    const { pos, size, buffer } = this
    return SUB(buffer, str, pos, size)
  }
  private term(extra = {}) {
    this.globalToken = this.block(extra)
    this.result.push(this.globalToken)
  }
}

export function SUB(buffer: string, str: string, pos = 0, size?: number) {
  if (!size) {
    size = buffer.length
  }
  const len = str.length
  const from = pos
  const to = pos + len
  if (to <= size) {
    let res = ''
    for (let i = from; i < to; i += 1) {
      res += buffer[i]
    }
    return res
  } else {
    return ''
  }
}
