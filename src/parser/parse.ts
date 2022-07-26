import detectIndent from 'detect-indent'

export type StateDefinition = {
  start?: Array<string>
  end?: Array<string>
  states?: Array<ResultTypes>
  curly?: true
}

export type ResultTypes =
  | 'expression'
  | 'uexpression'
  | 'code'
  | 'directive'
  | 'slotStart'
  | 'blockStart'
  | 'blockEnd'
  | 'text'

export type SystemBlocksType =
  | 'directive'
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
      'expression',
      'uexpression',
      'code',
      'directive',
      'slotStart',
      'blockStart',
      'blockEnd',
    ],
  },
  expression: {
    start: ['#{'],
    end: ['}'],
  },
  uexpression: {
    start: ['!{'],
    end: ['}'],
    curly: true,
  },
  code: {
    start: ['<#', '<#-'],
    end: ['#>', '-#>'],
  },
  directive: {
    start: ['<#@'],
    end: ['#>'],
  },
  blockStart: {
    start: ['<# block'],
    end: [': #>'],
  },
  slotStart: {
    start: ['<# slot'],
    end: [': #>'],
  },
  blockEnd: {
    start: ['<# end #>'],
  },
}
export default globalStates

export interface ParserResult {
  data: string
  pos: number
  line: number
  column: number
  type: ResultTypes
  start?: string
  end?: string
  eol?: boolean
}

export interface Items {
  content?: string
  pos: number
  line: number
  column: number
  start: string
  end: string
  eol: boolean
  type: ResultTypes
}

export type RequireItem = {
  name: string
  alias: string
}

export class CodeBlockDirectives {
  extend: string
  context: string = 'context'
  alias: Array<string>
  chunks: string
  includeMainChunk: boolean
  useHash: boolean
  content: boolean = true
  slots: boolean = true
  blocks: boolean = true
  partial: boolean = true
  options: boolean = true
  escapeIt: boolean = true
  // return promise
  promise: boolean
  // return callback
  callback: boolean
  requireAs: Array<RequireItem> = []
  push(init: ParserResult) {
    const data = init.data.trim()
    const s = data.split(' ')
    const name = s[0]
    const params = UNPARAM(s[1])
    switch (name) {
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
      case 'noEscape':
        this.escapeIt = false
        break
      case 'requireAs':
        this.requireAs.push({ name: params[0], alias: params[1] })
        break
      default:
        console.log('unknown directive: ' + name)
    }
  }
}

export class CodeBlock {
  name?: string
  main: Array<Items> = []
  // сделать все необходимые проверки для более чистого кода
  //
  directives: CodeBlockDirectives = new CodeBlockDirectives()
  slots?: { [slot: string]: CodeBlock } = {}
  blocks?: { [block: string]: CodeBlock } = {}
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
    res = res.match(/\(?([^\)].*\))/)?.[1] ?? res
    return res.split(',').map(UNQUOTE)
  } else {
    return []
  }
}

export class Parser {
  private buffer: string
  private size: number
  public INDENT: number
  private static INITIAL_STATE: ResultTypes = 'text'
  private static DEFAULT_TAB_SIZE = 2
  private globalState: ResultTypes
  private globalToken: ParserResult
  private pos: number = 0
  private line: number = 1
  private column: number = 1
  private curlyAware: boolean = false
  private curlyBalance: Array<number> = []
  private result: Array<ParserResult> = []
  public static parse(
    text: string | Buffer,
    options: { indent?: string | number } = {},
  ) {
    const parser = new Parser(
      typeof text == 'string' ? text : text.toString(),
      options,
    )
    parser.parse()
    return parser.process()
  }
  private constructor(value: string, options: { indent?: string | number }) {
    if (options.indent) {
      this.INDENT =
        typeof options.indent === 'string'
          ? options.indent.length
          : options.indent
    }
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
    if (state.curly) {
      this.curlyAware = true
    }
    if (state.start) {
      //has start
      let foundStart = false
      let foundEnd = false
      for (let i = state.start.length - 1; i >= 0; i -= 1) {
        const p = state.start[i]
        const subs = this.SUB(p).toLowerCase()
        if (subs == p) {
          foundStart = true
          this.globalState = currentState
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
              if (p.indexOf('}') > -1 && this.curlyAware) {
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
          this.term()
          break
        }
      }
      if (!found) {
        this.collect()
      }
    }
    if (state.curly) {
      this.curlyAware = false
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
    let state: SystemBlocksType = null
    for (let i = 0; i < resultSize; i += 1) {
      let r = this.result[i]
      let { type, pos, line, column, start, end, data, eol } = r
      const processPrevious = () => {
        do {
          if (curr.main.length > 0) {
            let prev = curr.main[curr.main.length - 1]
            if (prev.type == 'text' && prev.content.trim() == '') {
              curr.main.pop()
            } else {
              break
            }
          } else {
            break
          }
        } while (true)
      }

      if (curr.main.length > 0) {
        let prev = curr.main[curr.main.length - 1]
        if (prev.line != line) {
          curr.main[curr.main.length - 1].eol = true
        } else {
          curr.main[curr.main.length - 1].eol = false
        }
      }
      switch (type) {
        case 'directive':
          state = 'directive'
          processPrevious()
          curr.directives.push(r)
          break
        case 'blockStart':
          state = 'blockStart'
          processPrevious()
          curr = new CodeBlock(r)
          content.addBlock(curr)
          break
        case 'slotStart':
          state = 'slotStart'
          processPrevious()
          curr = new CodeBlock(r)
          content.addSlot(curr)
          break
        case 'blockEnd':
          state = 'blockEnd'
          curr = content
          break
        case 'code':
          if (data) {
            // if (start == '<#-') {
            processPrevious()
            // }
            // if (end == '-#>') {
            state = 'code'
            // }
            curr.main.push({
              content: data,
              pos,
              line,
              column,
              start,
              end,
              type,
              eol,
            })
          }
          break
        case 'expression':
          if (data) {
            curr.main.push({
              content: data,
              pos,
              line,
              column,
              start,
              end,
              type,
              eol,
            })
          }
          break
        case 'uexpression':
          if (data) {
            curr.main.push({
              content: data,
              pos,
              line,
              column,
              start,
              end,
              type,
              eol,
            })
          }
          break
        case 'text':
          if (data) {
            if (
              (state == 'directive' ||
                state == 'blockEnd' ||
                state == 'blockStart' ||
                state == 'slotStart' ||
                state == 'code') &&
              data.trim() == ''
            ) {
              break
            } else {
              state = null
              curr.main.push({
                content: data,
                pos,
                line,
                column,
                start,
                end,
                type,
                eol,
              })
            }
          }
          break
      }
    }
    return content
  }

  private SYMBOL() {
    const res = this.buffer[this.pos]
    if (this.curlyAware) {
      if (~res.indexOf('{')) {
        this.curlyBalance.push(this.pos)
      } else if (~res.indexOf('}')) {
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
    const { pos, line, column, globalState } = this
    return {
      data: '',
      pos,
      line,
      column,
      type: globalState,
      ...extra,
    }
  }
  private SUB(str) {
    const { pos, size, buffer } = this
    return SUB(buffer, pos, size, str)
  }
  private term(extra = {}) {
    // if (this.globalToken) this.globalToken.eol()
    this.globalToken = this.block(extra)
    this.result.push(this.globalToken)
  }
}

function SUB(buffer: string, pos: number, size: number, str: string) {
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
