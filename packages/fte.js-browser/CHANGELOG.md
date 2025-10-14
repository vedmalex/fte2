# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0-rc.13-canary.cd48650](https://github.com/vedmalex/fte2/compare/v3.0.0-rc.13...v3.0.0-rc.13-canary.cd48650) (2025-10-14)

**Note:** Version bump only for package fte.js-browser





# 3.0.0-rc.13 (2025-10-14)


### Bug Fixes

* **templates:** prevent [object Object] in bundles by stringifying and validating core/codeblock outputs; add sourcemap passthrough and proper return types ([0a33173](https://github.com/vedmalex/fte2/commit/0a33173e432b10dff5a059c959b95aa873036d94))


### Features

* **formatter:** add fte.js-formatter package, rules, CLI; apply formatting to demos ([64497ed](https://github.com/vedmalex/fte2/commit/64497ed13984abdaf7b92d28e519af62bef10256))
* **stream:** introduce experimental stream mode via AsyncGenerator in MainTemplate; add runStream API and tests ([7c1f5a1](https://github.com/vedmalex/fte2/commit/7c1f5a110583821853f8462c9d20dde2bbaeadeb))
* **templates,async:** add async helpers and tests; awaitable join across MainTemplate/codeblock; browser/standalone async APIs ([fbd810c](https://github.com/vedmalex/fte2/commit/fbd810c7a215ef4b69588254a492a3693b3b525c))
