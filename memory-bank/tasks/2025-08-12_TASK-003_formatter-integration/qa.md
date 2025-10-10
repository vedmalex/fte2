# QA

## Acceptance Criteria
- Formatting requests use `packages/fte.js-formatter` and produce expected output for existing golden tests.
- Linter diagnostics are surfaced with correct ranges and severities for common rules in sample files.
- Legacy formatter retained, with its tests either preserved against legacy or ported.

## Test Plan
- Unit tests for `tools/format.ts` and `tools/lint.ts`.
- Integration tests in `server/__tests__` hitting LSP handlers.
- Run entire monorepo test suite.
