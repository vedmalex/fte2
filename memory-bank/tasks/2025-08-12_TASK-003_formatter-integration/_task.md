# TASK-003: Integrate fte.js-formatter into vscode-ftejs-lang

- Created: 2025-08-12_23-38
- Status: 🟡 In Progress
- Owner: system

## Goal
Replace current ad-hoc formatter in `packages/vscode-ftejs-lang/server` with the formatter and linter from `packages/fte.js-formatter`, moving the existing formatter implementation and its tests into a separate module/location for preservation, and integrating linter diagnostics.

## Scope
- Extract current formatter logic from `packages/vscode-ftejs-lang/server/src/formatterCore.ts` into a preserved module/package (e.g., `packages/fte.js-formatter-legacy` or `packages/vscode-ftejs-lang/server/legacy-formatter/`).
- Wire `packages/fte.js-formatter`'s public API to provide formatting.
- Integrate `packages/fte.js-formatter` linter to surface diagnostics in LSP.
- Update tests accordingly; ensure previous formatter tests either point to legacy or are rewritten to hit new integration.

## Out of Scope
- Performance optimization beyond parity.
- New formatting rules beyond what `fte.js-formatter` provides.
