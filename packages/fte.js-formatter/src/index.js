Object.defineProperty(exports, '__esModule', { value: true })
exports.format = format
exports.lint = lint

const { Parser } = require('fte.js-parser')
const babelParser = require('@babel/parser')
const generate = require('@babel/generator').default

const DEFAULT_OPTIONS = {
  ensureFinalNewline: true,
  trimTrailingWhitespace: true,
}

const BABEL_PLUGINS = [
  'typescript',
  'jsx',
  'classProperties',
  'decorators-legacy',
  'dynamicImport',
  'optionalChaining',
  'nullishCoalescingOperator',
]

const EXPRESSION_PARSE_OPTIONS = {
  sourceType: 'module',
  plugins: BABEL_PLUGINS,
}

const STATEMENT_PARSE_OPTIONS = {
  ...EXPRESSION_PARSE_OPTIONS,
  allowReturnOutsideFunction: true,
  allowAwaitOutsideFunction: true,
}

const collectItems = (block, acc = []) => {
  if (!block) return acc
  if (Array.isArray(block.main)) {
    for (const item of block.main) {
      acc.push(item)
    }
  }
  const nestedBlocks = (block.blocks || {})
  for (const key of Object.keys(nestedBlocks)) {
    collectItems(nestedBlocks[key], acc)
  }
  const nestedSlots = block.slots || {}
  for (const key of Object.keys(nestedSlots)) {
    collectItems(nestedSlots[key], acc)
  }
  return acc
}

const getLineWhitespacePrefix = (src, index) => {
  const safeIndex = Math.max(0, index)
  const lineStart = src.lastIndexOf('\n', safeIndex - 1) + 1
  const before = src.slice(lineStart, safeIndex)
  const match = before.match(/[\t ]*$/)
  return match ? match[0] : ''
}

const formatJsExpression = (code) => {
  const trimmed = code.trim()
  if (!trimmed) return null
  try {
    const ast = babelParser.parseExpression(trimmed, EXPRESSION_PARSE_OPTIONS)
    const output = generate(ast, {
      compact: false,
      retainLines: false,
      comments: false,
    }).code
    return output.replace(/;\s*$/, '').trim()
  } catch {
    return null
  }
}

const formatJsCode = (code) => {
  const trimmed = code.trim()
  if (!trimmed) return null
  try {
    const ast = babelParser.parse(trimmed, STATEMENT_PARSE_OPTIONS)
    let output = generate(ast, {
      compact: false,
      retainLines: false,
      comments: false,
    }).code
    output = output.trim()
    return output
  } catch {
    const fallback = formatJsExpression(trimmed)
    return fallback
  }
}

const applyJsAwareFormatting = (input) => {
  let ast
  try {
    ast = Parser.parse(input)
  } catch {
    return input
  }
  if (!ast) return input

  const items = collectItems(ast)
  const replacements = []

  for (const item of items) {
    if (
      typeof item.pos !== 'number' ||
      typeof item.content !== 'string' ||
      typeof item.start !== 'string'
    ) {
      continue
    }
    const startOffset = item.pos + (item.start ? item.start.length : 0)
    const endOffset = startOffset + item.content.length
    if (startOffset < 0 || endOffset <= startOffset) continue

    const leading = item.content.match(/^\s*/)?.[0] ?? ''
    const trailing = item.content.match(/\s*$/)?.[0] ?? ''
    const trimmed = item.content.trim()
    if (!trimmed) continue

    if (item.type === 'expression' || item.type === 'uexpression') {
      const formatted = formatJsExpression(trimmed)
      if (!formatted) continue
      const indent = getLineWhitespacePrefix(input, startOffset)
      const lines = formatted.includes('\n')
        ? formatted.split(/\r?\n/).map((line, idx) =>
            idx === 0 ? line : indent + line,
          )
        : [formatted]
      const rewritten = leading + lines.join('\n') + trailing
      replacements.push({ start: startOffset, end: endOffset, value: rewritten })
    } else if (item.type === 'code') {
      const formatted = formatJsCode(trimmed)
      if (!formatted) continue
      const indent = getLineWhitespacePrefix(
        input,
        startOffset,
      )
      const lines = formatted.includes('\n')
        ? formatted.split(/\r?\n/).map((line, idx) =>
            idx === 0 ? line : indent + line,
          )
        : [formatted]
      const rewritten = leading + lines.join('\n') + trailing
      replacements.push({ start: startOffset, end: endOffset, value: rewritten })
    }
  }

  if (replacements.length === 0) return input

  replacements.sort((a, b) => b.start - a.start)
  let result = input
  for (const { start, end, value } of replacements) {
    result = result.slice(0, start) + value + result.slice(end)
  }
  return result
}

function format(input, options = {}) {
  const cfg = { ...DEFAULT_OPTIONS, ...options }
  const lines = input.split(/\r?\n/)
  const processed = []
  for (let i = 0; i < lines.length; i += 1) {
    let line = lines[i]
    if (cfg.trimTrailingWhitespace) {
      line = line.replace(/\s+$/g, '')
    }
    const HEAVY =
      /^(.*?)(<#@[^]*?#>|<#[-]?\s+(?:block|slot)[\s\S]*?:\s+#>|<#[-]?\s+end\s+[-]?#>|<%[-=_]?[\s\S]*?(?:-%>|_%>|%>)|<\*[\s\S]*?\*>)(.*)$/
    let rest = line
    let matched = false
    while (true) {
      const m = rest.match(HEAVY)
      if (!m) break
      matched = true
      const [, before, token, after] = m
      const beforeTrimmed = before.replace(/\s+$/g, '')
      const afterTrimmed = after.replace(/^\s+/g, '')
      if (beforeTrimmed) processed.push(beforeTrimmed)
      processed.push(token)
      rest = afterTrimmed
    }
    if (matched) {
      if (rest) processed.push(rest)
      continue
    }
    const openC = line.match(/^(.*?)(<\*)(.*)$/)
    if (openC) {
      const before = openC[1].replace(/\s+$/g, '')
      if (before) {
        processed.push(before)
        processed.push(openC[2] + openC[3])
        continue
      }
    }
    const closeC = line.match(/^(.*?)(\*>)(.*)$/)
    if (closeC) {
      const after = closeC[3].replace(/^\s+/g, '')
      if (after) {
        processed.push(closeC[1] + closeC[2])
        processed.push(after)
        continue
      }
    }
    processed.push(line)
  }
  const detectIndentStyle = (arr) => {
    let tabCount = 0
    let spaceCount = 0
    for (const l of arr) {
      const m = l.match(/^(\s+)/)
      if (!m) continue
      const ws = m[1]
      if (ws.includes('\t')) tabCount += 1
      else spaceCount += 1
    }
    if (cfg.indent === 'tab') return '\t'
    if (typeof cfg.indent === 'number' && cfg.indent > 0)
      return ' '.repeat(cfg.indent)
    if (tabCount > spaceCount) return '\t'
    return '  '
  }
  const indentUnit = detectIndentStyle(processed)
  const indented = []
  let depth = 0
  for (let i = 0; i < processed.length; i += 1) {
    const ln = processed[i]
    const isStart = /<#[-]?\s+(?:block|slot)\b[\s\S]*?:\s+#>/.test(ln)
    const isEnd = /<#[-]?\s+end\s+[-]?#>/.test(ln)
    const baseDepth = isEnd ? Math.max(depth - 1, 0) : depth
    const shouldIndent = ln.trim().length > 0
    const newLine = shouldIndent ? indentUnit.repeat(baseDepth) + ln.trim() : ''
    indented.push(newLine)
    if (isStart) depth += 1
    if (isEnd && depth > 0) depth -= 1
  }
  const collapsed = []
  let blankRun = 0
  for (let i = 0; i < indented.length; i += 1) {
    const ln = indented[i]
    const isBlank = ln.trim().length === 0
    if (isBlank) {
      blankRun += 1
      if (blankRun === 1) collapsed.push('')
    } else {
      blankRun = 0
      collapsed.push(ln)
    }
  }
  let output = collapsed.join('\n')
  output = applyJsAwareFormatting(output)
  if (cfg.ensureFinalNewline && output.length > 0 && !output.endsWith('\n')) {
    output += '\n'
  }
  return output
}

function lint(input) {
  const issues = []
  if (input.length > 0 && !input.endsWith('\n') && !input.endsWith('\r\n')) {
    issues.push({
      ruleId: 'final-newline',
      message: 'File should end with a newline',
      line: input.split(/\r?\n/).length,
      column: 1,
      severity: 'warning',
      fix: { description: 'Add a trailing newline' },
    })
  }

  const lines = input.split(/\r?\n/)
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]

    if (/\s+$/.test(line)) {
      issues.push({
        ruleId: 'no-trailing-whitespace',
        message: 'Trailing whitespace is not allowed',
        line: i + 1,
        column: line.length,
        severity: 'warning',
        fix: { description: 'Trim trailing spaces' },
      })
    }

    const mDir = line.match(/^(.*?)(<#@[^]*?#>)(.*)$/)
    if (mDir) {
      const before = mDir[1].trim()
      const after = mDir[3].trim()
      if (before || after) {
        issues.push({
          ruleId: 'directive-on-own-line',
          message: 'Directive must be the only content on its line',
          line: i + 1,
          column: (mDir.index ?? 0) + 1,
          severity: 'error',
          fix: { description: 'Place directive on its own line' },
        })
      }
    }

    const mStart = line.match(
      /^(.*?)(<#[-]?\s+(?:block|slot)[\s\S]*?:\s+#>)(.*)$/,
    )
    if (mStart) {
      const before = mStart[1].trim()
      const after = mStart[3].trim()
      if (before || after) {
        issues.push({
          ruleId: 'block-or-slot-on-own-line',
          message:
            'Block/slot declaration must be the only content on its line',
          line: i + 1,
          column: (mStart.index ?? 0) + 1,
          severity: 'error',
          fix: { description: 'Place block/slot declaration on its own line' },
        })
      }
    }

    const mEnd = line.match(/^(.*?)(<#[-]?\s+end\s+[-]?#>)(.*)$/)
    if (mEnd) {
      const before = mEnd[1].trim()
      const after = mEnd[3].trim()
      if (before || after) {
        issues.push({
          ruleId: 'end-on-own-line',
          message: 'End tag must be the only content on its line',
          line: i + 1,
          column: (mEnd.index ?? 0) + 1,
          severity: 'error',
          fix: { description: 'Place end tag on its own line' },
        })
      }
    }

    const mCode = line.match(/^(.*?)(<%[-=_]?[\s\S]*?(?:-%>|_%>|%>))(.*)$/)
    if (mCode) {
      const before = mCode[1].trim()
      const after = mCode[3].trim()
      if (before || after) {
        issues.push({
          ruleId: 'code-on-own-line',
          message: 'Code tag must be the only content on its line',
          line: i + 1,
          column: (mCode.index ?? 0) + 1,
          severity: 'warning',
          fix: { description: 'Place code tag on its own line' },
        })
      }
    }

    const HEAVY_GLOBAL =
      /(<#@[^]*?#>|<#[-]?\s+(?:block|slot)[\s\S]*?:\s+#>|<#[-]?\s+end\s+[-]?#>|<%[-=_]?[\s\S]*?(?:-%>|_%>|%>)|<\*[\s\S]*?\*>)/g
    const tokens = line.match(HEAVY_GLOBAL)
    if (tokens && tokens.length > 1) {
      issues.push({
        ruleId: 'one-construct-per-line',
        message: 'Only one template construct is allowed per line',
        line: i + 1,
        column: 1,
        severity: 'warning',
        fix: { description: 'Split constructs across lines' },
      })
    }

    const mOpenComment = line.match(/^(.*?)(<\*)(.*)$/)
    if (mOpenComment) {
      const before = mOpenComment[1].trim()
      const after = mOpenComment[3].trim()
      if (before || after) {
        issues.push({
          ruleId: 'comment-on-own-line',
          message: 'Comment markers must not be inline with other content',
          line: i + 1,
          column: (mOpenComment.index ?? 0) + 1,
          severity: 'warning',
          fix: { description: 'Place comment on its own line(s)' },
        })
      }
    }

    const mEmptyCurly = line.match(/(#\{|!\{)\s*\}/)
    if (mEmptyCurly) {
      issues.push({
        ruleId: 'no-empty-expression',
        message: 'Empty expression is not allowed',
        line: i + 1,
        column: (mEmptyCurly.index ?? 0) + 1,
        severity: 'error',
        fix: { description: 'Remove it or provide content' },
      })
    }

    if (
      /(<%_?)\s*(?:-%>|_%>|%>)/.test(line) ||
      /(<#-?)\s*(?:-#>|#>)/.test(line)
    ) {
      const emptyPercent = line.match(/<%_?\s*(?:-%>|_%>|%>)/)
      const emptyHash = line.match(/<#-?\s*(?:-#>|#>)/)
      if (emptyPercent || emptyHash) {
        issues.push({
          ruleId: 'no-empty-code',
          message: 'Empty code tag is not allowed',
          line: i + 1,
          column: ((emptyPercent || emptyHash)?.index ?? 0) + 1,
          severity: 'warning',
          fix: { description: 'Remove it' },
        })
      }
    }
  }

  try {
    let ParserMod
    try {
      ParserMod = require('fte.js-parser')
    } catch {
      try {
        ParserMod = require('../fte.js-parser/dist/index.js')
      } catch {
        ParserMod = undefined
      }
    }
    const ParserClass = ParserMod?.Parser
    if (ParserClass) {
      const root = ParserClass.parse(input)
      const blockEntries = Object.entries(root?.blocks ?? {})
      for (const [blockName, block] of blockEntries) {
        const nested = Object.keys(block.blocks ?? {}).length > 0
        if (nested) {
          issues.push({
            ruleId: 'no-nested-blocks',
            message: `Block "${blockName}" must not contain nested blocks`,
            line: 1,
            column: 1,
            severity: 'error',
          })
        }
      }
    }
  } catch {
    // ignore parser errors
  }

  {
    const lines2 = input.split(/\r?\n/)
    let blockDepth = 0
    for (let i = 0; i < lines2.length; i += 1) {
      const line = lines2[i]
      const isBlockStart = /<#[-]?\s+block\b[\s\S]*?:\s+#>/.test(line)
      const isEnd = /<#[-]?\s+end\s+[-]?#>/.test(line)
      if (isBlockStart) {
        if (blockDepth > 0) {
          issues.push({
            ruleId: 'no-nested-blocks',
            message: 'Nested blocks are not allowed',
            line: i + 1,
            column: 1,
            severity: 'error',
          })
        }
        blockDepth += 1
      }
      if (isEnd && blockDepth > 0) {
        blockDepth -= 1
      }
    }
  }

  return issues
}
