## Test Fix Plan

1. Restore full sourcemap coverage in `packages/fte.js`:
   - Ensure bundler stress test generates `.map` files for demo templates.
   - Investigate why `collectFiles` currently returns zero results and adjust build inputs or expectations.
2. Finalise async test conversions:
   - Confirm every test previously using `done` now awaits the async helper.
   - Clean up temporary directories after each run to avoid cross-test contamination.
3. Re-run package-level suites (`packages/fte.js`, `fte.js-templates`, `fte.js-parser`, `fte.js-standalone`, `fte.js-formatter`) and verify green.
4. Once passing locally, execute top-level `bun run test` and capture results for confirmation.
5. Add regression coverage if new edge-cases are discovered (e.g. missing sourcemap files, nested context typing) before final review.
