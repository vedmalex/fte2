# Plan

1. Discovery (LEVER)
   - Map `packages/fte.js-formatter` API: `format(text, options)`, linter API, config resolution.
   - Identify current formatter entry points in `vscode-ftejs-lang` (formatting request handler, config).
   - Inventory tests under `packages/vscode-ftejs-lang/server/__tests__/formatter-*.test.js`.

2. Extraction of legacy formatter
   - Move `server/src/formatterCore.ts` and any helpers into `server/legacy-formatter/` folder.
   - Update existing formatter tests to import legacy path for preservation, or mark legacy tests separately.

3. Integration
   - Replace onDocumentFormatting handler to call `@fte.js-formatter` instead of legacy.
   - Add linter pass on demand (document save or command) to surface diagnostics using LSP diagnostics API.
   - Configuration: map VS Code settings to formatter options (indent, keep blank lines, rules enablement).

4. Tests
   - Keep golden formatting tests using new formatter to ensure parity.
   - Add tests for linter diagnostics mapping (severity, range, message, ruleId).

5. DX
   - Update `USAGE.md` and extension docs.

6. QA
   - Run test suite.
   - Smoke test with example templates.
