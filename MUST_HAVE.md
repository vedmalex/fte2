### MUST HAVE improvements

- **Consistent return contracts**
  - `codeblock.njs`: always return `{ code, map? }` with strong typing
  - `MainTemplate.*.njs`: keep `{code,map?}` for TS and JS templates uniformly
  - Normalize singlefile/compiled templates to embed only stringified, validated code

- **Source maps quality**
  - End-to-end sourcemap validation tests (compile → bundle → run → map positions)
  - Map chunk boundaries and slot/block origins; stress tests with nested blocks
  - CLI flags to toggle `inline`/external maps; document behavior in README

- **Type safety and DX**
  - Strengthen public typings in `fte.js-base`, `fte.js-templates`, `fte.js-standalone`
  - Export stable template runtime types (`TemplateOptions`, `{code,map}` contracts)
  - Strict null checks across packages; remove `any` in signatures where feasible
  - Improve inference: expose stable API to get inferred context types programmatically

- **Chunking and partials**
  - Unify chunk API across templates (hash vs array); add guards when used as partials
  - Better error messages if chunked template is used as a partial
  - Option to include/exclude main chunk consistently in both hash/array modes

- **Bundling and formats**
  - Output ESM/CJS selectable targets (including `singlefile.*`) with tests
  - Add `standalone.esm` bundles and verify browser usage (`globalThis`) paths
  - Verify SWC/TS transpilation pipeline for both modes; avoid syntax regressions

- **CLI and build UX**
  - CLI flags for sourcemaps, minify, pretty, target (cjs/esm), single/standalone
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
  - Stabilize `{code,map}` return everywhere and update typings
  - Finish sourcemap E2E tests and CLI flags
  - Ship ESM builds for standalone/singlefile

- **Roadmap (mid-term)**
  - Plugin system for custom code transforms pre/post codeblock
  - Rich error diagnostics with original source excerpts and suggestions
  - Optional caching layer for parse/compile in watch mode
