type LintIssue = {
  ruleId: string
  message: string
  line: number
  column: number
  severity: 'error' | 'warning' | 'info'
  fix?: { description: string }
}
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { lint } = require('fte.js-formatter') as {
  lint: (input: string) => LintIssue[]
}

export function lintText(input: string) {
  return lint(String(input ?? '')) as LintIssue[]
}
