export interface FormatOptions {
  indent?: number | 'tab'
  ensureFinalNewline?: boolean
  trimTrailingWhitespace?: boolean
}

export type LintSeverity = 'error' | 'warning' | 'info'

export interface LintIssue {
  ruleId: string
  message: string
  line: number
  column: number
  severity: LintSeverity
  fix?: {
    description: string
  }
}

const DEFAULT_OPTIONS: Required<Pick<FormatOptions, 'ensureFinalNewline' | 'trimTrailingWhitespace'>> = {
  ensureFinalNewline: true,
  trimTrailingWhitespace: true,
}

/**
 * Very first cut formatter: trims trailing spaces, ensures final newline,
 * and enforces directives to be on their own line.
 */
export function format(input: string, options: FormatOptions = {}): string {
  const cfg = { ...DEFAULT_OPTIONS, ...options }

  // Normalize line endings to \n for processing, preserve \r\n when present line-by-line
  const lines = input.split(/\r?\n/)
  const processed: string[] = []

  for (let i = 0; i < lines.length; i += 1) {
    let line = lines[i]

    if (cfg.trimTrailingWhitespace) {
      line = line.replace(/\s+$/g, '')
    }

    // Iteratively split heavy template tokens into standalone lines
    // Covers: directive, block/slot start, end, code tags, comments
    const HEAVY = /^(.*?)(<#@[^]*?#>|<#[\-]?\s+(?:block|slot)[\s\S]*?:\s+#>|<#[\-]?\s+end\s+[\-]?#>|<%[-=_]?[\s\S]*?(?:-%>|_%>|%>)|<\*[\s\S]*?\*>)(.*)$/
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

    // Ensure comment start/end markers are not inline with other content
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

  // Indentation pass: compute consistent indentation for block/slot structures
  const detectIndentStyle = (arr: string[]): string => {
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
    if (typeof cfg.indent === 'number' && cfg.indent > 0) return ' '.repeat(cfg.indent)
    if (tabCount > spaceCount) return '\t'
    return '  '
  }

  const indentUnit = detectIndentStyle(processed)
  const indented: string[] = []
  let depth = 0
  for (let i = 0; i < processed.length; i += 1) {
    const ln = processed[i]
    const isStart = /<#[\-]?\s+(?:block|slot)\b[\s\S]*?:\s+#>/.test(ln)
    const isEnd = /<#[\-]?\s+end\s+[\-]?#>/.test(ln)

    const baseDepth = isEnd ? Math.max(depth - 1, 0) : depth
    const shouldIndent = ln.trim().length > 0
    const newLine = shouldIndent ? indentUnit.repeat(baseDepth) + ln.trim() : ''
    indented.push(newLine)

    if (isStart) depth += 1
    if (isEnd && depth > 0) depth -= 1
  }

  // Collapse multiple blank lines to a single blank line
  const collapsed: string[] = []
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

  if (cfg.ensureFinalNewline && output.length > 0 && !output.endsWith('\n')) {
    output += '\n'
  }

  return output
}

export function lint(input: string): LintIssue[] {
  const issues: LintIssue[] = []

  // Check final newline
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

    // trailing whitespace
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

    // directive on own line
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

    // block/slot start on own line
    const mStart = line.match(/^(.*?)(<#[\-]?\s+(?:block|slot)[\s\S]*?:\s+#>)(.*)$/)
    if (mStart) {
      const before = mStart[1].trim()
      const after = mStart[3].trim()
      if (before || after) {
        issues.push({
          ruleId: 'block-or-slot-on-own-line',
          message: 'Block/slot declaration must be the only content on its line',
          line: i + 1,
          column: (mStart.index ?? 0) + 1,
          severity: 'error',
          fix: { description: 'Place block/slot declaration on its own line' },
        })
      }
    }

    // end on own line
    const mEnd = line.match(/^(.*?)(<#[\-]?\s+end\s+[\-]?#>)(.*)$/)
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

    // code tag on own line: <% ... %> or <%_ ... _%> (scriptlet)
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

    // one-construct-per-line: flag multiple template tokens on one line
    const HEAVY_GLOBAL = /(<#@[^]*?#>|<#[\-]?\s+(?:block|slot)[\s\S]*?:\s+#>|<#[\-]?\s+end\s+[\-]?#>|<%[-=_]?[\s\S]*?(?:-%>|_%>|%>)|<\*[\s\S]*?\*>)/g
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

    // comments must not be inline with other content
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
    // empty expressions like #{} or !{}
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

    // empty code tags like <% %>, <%_ %>, <# #>, <#- #>
    if (/(<%_?)\s*(?:-%>|_%>|%>)/.test(line) || /(<#-?)\s*(?:-#>|#>)/.test(line)) {
      // Ensure truly empty (no non-whitespace between start and end)
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

  // Structural checks using parser (prefer app dependency, fallback to workspace sibling)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    let ParserMod: any
    try {
      ParserMod = require('fte.js-parser')
    } catch {
      try {
        ParserMod = require('../fte.js-parser/dist/index.js')
      } catch {
        ParserMod = undefined
      }
    }
    const Parser = ParserMod?.Parser
    if (Parser) {
      const root = Parser.parse(input)
      const blockEntries = Object.entries((root as any).blocks ?? {}) as Array<[string, any]>
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
    // ignore parser errors; formatter should still work in basic mode
  }

  // Structural scan without parser: detect nested block declarations
  {
    const lines2 = input.split(/\r?\n/)
    let blockDepth = 0
    for (let i = 0; i < lines2.length; i += 1) {
      const line = lines2[i]
      const isBlockStart = /<#[\-]?\s+block\b[\s\S]*?:\s+#>/.test(line)
      const isEnd = /<#[\-]?\s+end\s+[\-]?#>/.test(line)
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
