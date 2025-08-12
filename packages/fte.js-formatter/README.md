# fte.js-formatter

Formatter & Linter for FTE templates (`.nhtml`). Provides importable API and CLI.

## Install (workspace)

This repo uses pnpm workspaces. In external apps:

```bash
npm i -D fte.js-formatter
```

## CLI

```bash
# format stdin -> stdout
cat template.nhtml | fte-format > formatted.nhtml

# format files in-place
fte-format --write demo/**/*.nhtml

# check (CI)
fte-format --check demo/**/*.nhtml
```

## API

```ts
import { format, lint } from 'fte.js-formatter'

const source = `<# block main : #> Hello <# end #>`
const pretty = format(source)

const issues = lint(source)
// [{ ruleId: 'end-on-own-line', ... }, ...]
```

## Rules (Linter)

- directive-on-own-line: `<#@ ... #>` only content on line
- block/slot-on-own-line: `<# block ... : #>`, `<# slot ... : #>` only content on line
- end-on-own-line: `<# end #>` only content on line
- code-on-own-line: `<% ... %>`, `<%= ... %>`, `<%- ... %>` only content on line
- comment-on-own-line: `<* ... *>` not inline with other content
- one-construct-per-line: only one template construct per line
- no-trailing-whitespace
- final-newline
- no-empty-expression: `#{}` or `!{}` not allowed
- no-empty-code: `<% %>`, `<# #>` not allowed

## Formatting

- Splits constructs so there is one construct per line
- Indents content inside block/slot with 2 spaces by default (configurable)
- Collapses multiple blank lines to a single blank line
- Trims trailing spaces; ensures final newline

## Options

```ts
type FormatOptions = {
  indent?: number | 'tab'
  ensureFinalNewline?: boolean
  trimTrailingWhitespace?: boolean
}
```

## Notes

- Parser-backed checks are used when `fte.js-parser` is available; otherwise, safe fallbacks are applied.
- Rules are conservative to avoid breaking semantics; please open issues for edge cases.
