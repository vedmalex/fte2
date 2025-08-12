# Agents Guide (fte.js-formatter)

This guide describes how AI/automation agents should interact with the fte.js-formatter package via API and CLI to ensure deterministic, safe, and reproducible outcomes.

## Capabilities
- Format FTE templates (`.nhtml`) deterministically
- Lint templates and report actionable issues with rule IDs
- CLI for batch processing (`fte-format`)
- Importable API for programmatic use (`format`, `lint`)

## Core APIs
```ts
import { format, lint } from 'fte.js-formatter'

// Format source text
type FormatOptions = {
  indent?: number | 'tab'
  ensureFinalNewline?: boolean
  trimTrailingWhitespace?: boolean
}
const pretty = format(source, options?)

// Lint and return issues (no mutations)
const issues = lint(source)
// -> Array<{ ruleId, message, line, column, severity, fix? }>
```

## Determinism & Idempotency
- `format(source)` is deterministic for a given input and options
- Running `format` twice yields the same output (idempotent)
- Linter is pure: does not modify input, only returns diagnostics

## Rule Set (summary)
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

## Optional Parser Dependency
- If `fte.js-parser` is present in the environment, some structural checks (e.g., nested blocks) are enhanced
- When absent, formatter falls back to robust regex-based checks
- Agents should not attempt to install dependencies at runtime; prefer using the available environment

## Error Handling
- API throws only for non-string inputs or critical internal errors (rare)
- CLI exits non-zero in `--check` mode when changes are needed; otherwise prints warnings and proceeds

## Safety & Filesystem
- Prefer using API on in-memory content where possible
- When using CLI `--write`, run on explicit file globs and record diffs in your system
- Avoid running on untrusted templates if your policy prohibits executing Node.js; the formatter does not execute template code, it only parses strings

## Recommended Workflows
- Pre-commit: run `fte-format --check` and block commit on differences
- Auto-fix: run `fte-format --write` on staged template files
- CI: run in check mode; fail if non-compliant files detected

## Output Stability Notes
- Indentation defaults to 2 spaces; can be overridden via `indent`
- Multiple blank lines are collapsed to a single blank line
- Final newline is enforced by default
- Formatting is whitespace- and layout-focused; it does not interpret template semantics beyond structural tokens

## Performance Guidance
- Prefer batching files via CLI for large codebases
- API is synchronous; for huge files, run in worker context if your agent supports parallelism

## Telemetry & Privacy
- No network access, no telemetry
- Formatter operates entirely locally on provided strings/files

## Examples
```ts
import { format, lint } from 'fte.js-formatter'

const src = "<# block main : #> Hello <% const x=1 %> <# end #>\n"
const out = format(src)
// Enforced own-lines + indentation

const problems = lint(src)
for (const p of problems) {
  console.log(`${p.severity} ${p.ruleId} ${p.line}:${p.column} ${p.message}`)
}
```

## Agent Do/Don’t
- Do: run `format` on buffers before writing
- Do: surface `lint` diagnostics with ruleId and suggested fixes
- Don’t: mutate formatter rules on-the-fly
- Don’t: assume presence of `fte.js-parser`; handle both paths
