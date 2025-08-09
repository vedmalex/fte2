### MUST HAVE improvements

#### Completed

- **Consistent return contracts**
  - `codeblock.njs`: always returns `{ code, map? }` (stringified code; map when enabled)
  - `MainTemplate.*.njs`: unified to `{ code, map? }` for TS and JS
  - `singlefile.*` and `compiled.njs`: validate and embed only stringified, validated code

- **Bundling and formats**
  - ESM/CJS selectable targets via CLI `--format cjs|esm` (with tests for singlefile/standalone)
  - Fixed ESM standalone template export; added tests

- **CLI and build UX**
  - Sourcemap flags supported and tested: `--sourcemap`, `--no-inline-map`
  - README and `--help` synced with examples/notes
  - Failed output persisted for debugging in `packages/fte.js/tmp` (plus `.err` files in mem-fs)
  - Output filename logic respects provided extension (no double suffix)

- **Type safety and DX**
  - Exported stable template runtime types: `TemplateOptions`, `TemplateResult`
  - Exported `BuildOptions` from `fte.js`

#### Remaining

- **Source maps quality**
  - End-to-end sourcemap validation tests (compile → bundle → run → map positions)
  - Map chunk boundaries and slot/block origins; stress tests with nested blocks
  - Document mapping guarantees/limitations per template

- **Type safety and DX**
  - Strengthen public typings in `fte.js-base`, `fte.js-templates`, `fte.js-standalone`
  - Strict null checks across packages; remove `any` in signatures where feasible
  - Improve inference API surface (friendly helpers over raw `Inferer`)

- **Chunking and partials**
  - Unify chunk API across templates (hash vs array); add guards when used as partials
  - Better error messages if chunked template is used as a partial
  - Option to include/exclude main chunk consistently in both hash/array modes

- **Bundling and formats**
  - Verify browser usage paths for ESM (e.g. `globalThis`), provide example
  - Verify SWC/TS transpilation pipeline for both modes; avoid syntax regressions

- **CLI and build UX**
  - Helpful error output with snippet + original location when SWC parse fails
  - Write last failed output to a known location (already started) with path hint

- **Testing and coverage**
  - Increase coverage for `TemplateFactoryBase`, merge logic, and runtime slot resolution
  - Add integration tests for: multi-file projects, aliasing, `requireAs`, `extend`
  - Snapshot tests for generated bundles (JS/TS/ESM), with no `[object Object]` regression

- **Performance**
  - Benchmark parser + codegen on large templates; identify hotspots
  - Avoid repeated partial invocations in hot paths; memoize where safe
  - Consider lazy sourcemap generation behind a flag to speed up defaults

- **Tooling/CI**
  - Enforce formatting (dprint/prettier) and lint in CI across workspaces
  - Add type-check step per package in CI; block on public API breaks
  - Dependabot/lockfile maintenance; address GitHub-reported vulnerabilities

- **Documentation**
  - Authoritative contracts for each template (inputs/outputs, chunks, sourcemaps)
  - Migration guide from previous return-shape behaviors to new stable contracts
  - Examples (browser/node/esm) + troubleshooting guide

- **Roadmap (short-term)**
  - Finish sourcemap E2E tests and position validation
  - Ship browser-facing ESM examples and docs

- **Roadmap (mid-term)**
  - Plugin system for custom code transforms pre/post codeblock
  - Rich error diagnostics with original source excerpts and suggestions
  - Optional caching layer for parse/compile in watch mode
