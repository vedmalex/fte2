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
  - Ensure `sourceMappingURL` comments survive SWC print/minify

- **Type safety and DX**
  - Exported stable template runtime types: `TemplateOptions`, `TemplateResult`
  - Exported `BuildOptions` from `fte.js`
  - Always inject `@typedef` in CJS singlefile bundles (fallback to empty typedef when inference yields no fields)

#### Remaining

- **Source maps quality**
  - Document mapping guarantees/limitations per template (levels of fidelity, examples)
  - Add stress tests: very long lines, CRLF/LF mixed inputs, deep nesting

- **Type safety and DX**
  - Strengthen public typings in `fte.js-base`, `fte.js-templates`, `fte.js-standalone`
  - Strict null checks across packages; remove `any` in signatures where feasible
  - Improve inference API surface (friendly helpers over raw `Inferer`)

- **Async templates**
  - Opt-in async mode via `directives.promise` and `options.promise`
  - New factory APIs: `runAsync`, `runPartialAsync` keeping sync APIs untouched
  - Clean async codegen: helpers to await values without scattering `await` through emitted code
  - Preserve sourcemaps fidelity in async path
  - Tests (unit/integration/E2E) and docs with examples (Node/Browser)

- **Chunking and partials**
  - Unify chunk API across templates (hash vs array); add guards when used as partials
  - Better error messages if chunked template is used as a partial
  - Option to include/exclude main chunk consistently in both hash/array modes

- **Bundling and formats**
  - Provide and document browser ESM example (globalThis-safe, CDN-friendly)
  - Verify SWC/TS transpilation pipeline for both modes; avoid syntax regressions

- **CLI and build UX**
  - Helpful error output with snippet + original location when SWC parse fails
  - Write last failed output to a known location (already started) with path hint

- **Testing and coverage**
  - Increase coverage for `TemplateFactoryBase`, merge logic, and runtime slot resolution (keep expanding)
  - Add integration tests for: multi-file projects, aliasing, `requireAs`, `extend` (more real-world graphs)
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
  - “Source map guarantees” doc per template with examples
  - Migration guide from previous return-shape behaviors to new stable contracts
  - Examples (browser/node/esm) + troubleshooting guide

- **Roadmap (short-term)**
  - Finish sourcemap E2E tests and position validation
  - Ship browser-facing ESM examples and docs

- **Roadmap (mid-term)**
  - Plugin system for custom code transforms pre/post codeblock
  - Rich error diagnostics with original source excerpts and suggestions
  - Optional caching layer for parse/compile in watch mode
