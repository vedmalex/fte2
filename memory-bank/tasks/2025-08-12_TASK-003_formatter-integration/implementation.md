# IMPLEMENTATION

## Decisions
- Use `packages/fte.js-formatter/src/index.ts` programmatic API for formatting.
- Introduce `tools/format.ts` and `tools/lint.ts` as integration glue called by server.
- Preserve legacy formatter under `server/legacy-formatter/` and mark tests accordingly.

## Steps
- [ ] Create `packages/vscode-ftejs-lang/tools/format.ts` to wrap formatter.
- [ ] Create `packages/vscode-ftejs-lang/tools/lint.ts` to wrap linter.
- [ ] Move `server/src/formatterCore.ts` to `server/legacy-formatter/formatterCore.ts` and update imports.
- [ ] Replace server formatting handler to call `tools/format.ts`.
- [ ] Add linter diagnostics provider in server.
- [ ] Update/relocate tests.
- [ ] Update docs.
