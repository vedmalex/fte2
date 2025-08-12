# API Usage (fte.js-formatter)

This document specifies how external libraries and applications should consume the formatter API and CLI.

## Install

```bash
npm i -D fte.js-formatter
# or pnpm add -D fte.js-formatter
```

## Import (CJS/ESM)

```ts
// ESM
import { format, lint } from 'fte.js-formatter'

// CJS
const { format, lint } = require('fte.js-formatter')
```

## Format

```ts
import { format } from 'fte.js-formatter'

const pretty = format(source, {
  indent: 2,                 // number | 'tab'
  ensureFinalNewline: true,  // default true
  trimTrailingWhitespace: true, // default true
})
```

## Lint

```ts
import { lint } from 'fte.js-formatter'

const issues = lint(source)
// -> { ruleId, message, line, column, severity: 'error'|'warning'|'info', fix? }
```

## CLI

```bash
# format in-place
npx fte-format --write "src/**/*.nhtml"

# check only (CI)
npx fte-format --check "src/**/*.nhtml"

# stdin -> stdout
cat a.nhtml | npx fte-format > a.prettified.nhtml
```

## Rules Overview

- directive-on-own-line
- block/slot-on-own-line
- end-on-own-line
- code-on-own-line (includes <%= and <%-)
- comment-on-own-line
- one-construct-per-line
- no-trailing-whitespace
- final-newline
- no-empty-expression
- no-empty-code

## Behavior Guarantees

- Idempotent formatting: formatting already-formatted code yields same output
- Deterministic output for a given input and options
- No code execution; string-based processing only

## TypeScript

The package ships with typings: `dist/index.d.ts`.

```ts
import type { FormatOptions, LintIssue } from 'fte.js-formatter'
```

## Optional Integration with fte.js-parser

If `fte.js-parser` is present in your environment, additional structural checks (e.g., nested blocks) are performed. The dependency is optional; the formatter safely falls back to regex-based checks.

## Versioning & Compatibility

- Follows semver for public API surface (`format`, `lint`, options & issue shape)
- Rule set may evolve; consult the changelog when upgrading for rule additions

## Best Practices

- Run formatter in pre-commit and CI (check mode) to keep templates consistent
- Review and handle `lint` diagnostics, particularly `error` severity
- For large projects, prefer CLI over per-file API calls for performance
