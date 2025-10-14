# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0-canary.ade27ca](https://github.com/vedmalex/fte2/compare/v3.0.0-canary.430e6b6...v3.0.0-canary.ade27ca) (2025-10-14)

**Note:** Version bump only for package fte.js-templates





# [3.0.0-canary.430e6b6](https://github.com/vedmalex/fte2/compare/v3.0.0-canary.75702da...v3.0.0-canary.430e6b6) (2025-10-14)

**Note:** Version bump only for package fte.js-templates





# [3.0.0-canary.75702da](https://github.com/vedmalex/fte2/compare/v3.0.0-canary.7bdad5c...v3.0.0-canary.75702da) (2025-10-14)

**Note:** Version bump only for package fte.js-templates





# [3.0.0-canary.7bdad5c](https://github.com/vedmalex/fte2/compare/v3.0.0-canary.1912a68...v3.0.0-canary.7bdad5c) (2025-10-14)

**Note:** Version bump only for package fte.js-templates





# [3.0.0-canary.1912a68](https://github.com/vedmalex/fte2/compare/v3.0.0-canary.527c03b...v3.0.0-canary.1912a68) (2025-10-14)

**Note:** Version bump only for package fte.js-templates





# [3.0.0-canary.527c03b](https://github.com/vedmalex/fte2/compare/v3.0.0-canary.04f699a...v3.0.0-canary.527c03b) (2025-10-14)

**Note:** Version bump only for package fte.js-templates





# [3.0.0-canary.04f699a](https://github.com/vedmalex/fte2/compare/v3.0.0-rc.13-canary.cd48650...v3.0.0-canary.04f699a) (2025-10-14)

**Note:** Version bump only for package fte.js-templates





# [3.0.0-rc.13-canary.cd48650](https://github.com/vedmalex/fte2/compare/v3.0.0-rc.13...v3.0.0-rc.13-canary.cd48650) (2025-10-14)

**Note:** Version bump only for package fte.js-templates





# 3.0.0-rc.13 (2025-10-14)


### Bug Fixes

* **templates:** correct ESM standalone template to export named run() and fix syntax ([6e4f3fe](https://github.com/vedmalex/fte2/commit/6e4f3feb0e975d8fdd728624817fd69255019dba))
* **templates:** prevent [object Object] in bundles by stringifying and validating core/codeblock outputs; add sourcemap passthrough and proper return types ([0a33173](https://github.com/vedmalex/fte2/commit/0a33173e432b10dff5a059c959b95aa873036d94))
* **templates:** validate core code in singlefile.es6.njs to avoid inserting objects into bundles ([706773a](https://github.com/vedmalex/fte2/commit/706773acee9381567c8c23388c5f9e323b7c9054))


### Features

* **formatter:** add fte.js-formatter package, rules, CLI; apply formatting to demos ([64497ed](https://github.com/vedmalex/fte2/commit/64497ed13984abdaf7b92d28e519af62bef10256))
* **fte.js:** add fte tagged template helper and export; update templates runtime typing ([73a3c05](https://github.com/vedmalex/fte2/commit/73a3c05b263ce4991ed13d982394c68ae86677e7))
* **stream:** add abort signal and deindent handling in stream mode ([6402100](https://github.com/vedmalex/fte2/commit/6402100f3f1904f672b80c2653d163654ec8a336))
* **stream:** basic chunk-stream support by yielding per-chunk content as async iterables ([5e04e79](https://github.com/vedmalex/fte2/commit/5e04e79d5caf32e9ccbc85cee46829eba7da8fc1))
* **stream:** introduce experimental stream mode via AsyncGenerator in MainTemplate; add runStream API and tests ([7c1f5a1](https://github.com/vedmalex/fte2/commit/7c1f5a110583821853f8462c9d20dde2bbaeadeb))
* **templates,async:** add async helpers and tests; awaitable join across MainTemplate/codeblock; browser/standalone async APIs ([fbd810c](https://github.com/vedmalex/fte2/commit/fbd810c7a215ef4b69588254a492a3693b3b525c))
* **templates:** port sourcemap plumbing into .njs templates; unwrap partial results; begin aligning TS output ([7a10863](https://github.com/vedmalex/fte2/commit/7a10863ad3d79dc038e7eaeeead917c3cb925651))
