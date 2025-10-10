## Summary

- Converted outstanding Vitest suites in `packages/fte.js` to async/await helpers, removing deprecated `done` callbacks.
- Fixed inline template compilation by wiring `compileFull` to call `compiled.njs` with parser context directly.
- Addressed type inference regressions by guarding parent creation in `makeAST` and updating expectations.
- File writer now awaits mem-fs commit promise; bundler tests verify context typedef emission and sourcemap outputs asynchronously.
- Template runtime now instantiates `TemplateFactoryStandalone` directly so compile paths share async/stream helpers and option propagation.
- CLI build coverage exercises inline vs external sourcemaps and ESM bundles; `writeFile`/`build` retain map hints and emit `.err` artifacts on failures.
- Added stress inspector scripts to mirror bundler inputs and inspect generated sourcemaps under `demo` fixtures.
- Sourcemap stress bundle now targets root `demo` fixtures and emits `.map` files (noting SWC parse warnings on legacy slots still surface via `.err` outputs).
- VSCode formatter suites now run under Vitest with `vi.mock`-backed Prettier stubs and Module.require interception; full `pnpm vitest run` is green.


• - Adjusted the sourcemap stress test to resolve the repository root once (packages/fte.js/src/__tests__/sourcemap.stress.bundle.test.ts:20-
    26), so the build now sweeps the real demo fixtures and writes into the root tmp/stress directory.
  - Refreshed the project summary to capture that the stress bundle now emits .map files while still surfacing legacy slot parse warnings
    (summary.md:10).

  Tests: pnpm vitest run packages/fte.js/src/__tests__/sourcemap.stress.bundle.test.ts
  sanitise those templates to avoid ternary property names, or 2) ignore/clean the emitted .err files after the stress check.
