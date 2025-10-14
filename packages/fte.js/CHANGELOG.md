# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0-canary.8d33ce9](https://github.com/vedmalex/fte2/compare/v3.0.0-canary.3bd5a0b...v3.0.0-canary.8d33ce9) (2025-10-14)

**Note:** Version bump only for package fte.js





# [3.0.0-canary.3bd5a0b](https://github.com/vedmalex/fte2/compare/v3.0.0-canary.d23789d...v3.0.0-canary.3bd5a0b) (2025-10-14)

**Note:** Version bump only for package fte.js





# [3.0.0-canary.d23789d](https://github.com/vedmalex/fte2/compare/v3.0.0-canary.6026b60...v3.0.0-canary.d23789d) (2025-10-14)

**Note:** Version bump only for package fte.js





# [3.0.0-canary.6026b60](https://github.com/vedmalex/fte2/compare/v3.0.0-canary.569d190...v3.0.0-canary.6026b60) (2025-10-14)

**Note:** Version bump only for package fte.js





# [3.0.0-canary.569d190](https://github.com/vedmalex/fte2/compare/v3.0.0-canary.614bf63...v3.0.0-canary.569d190) (2025-10-14)

**Note:** Version bump only for package fte.js





# [3.0.0-canary.614bf63](https://github.com/vedmalex/fte2/compare/v3.0.0-canary.3f322b6...v3.0.0-canary.614bf63) (2025-10-14)

**Note:** Version bump only for package fte.js





# [3.0.0-canary.3f322b6](https://github.com/vedmalex/fte2/compare/v3.0.0-canary.f95337b...v3.0.0-canary.3f322b6) (2025-10-14)

**Note:** Version bump only for package fte.js





# [3.0.0-canary.f95337b](https://github.com/vedmalex/fte2/compare/v3.0.0-canary.cc3b592...v3.0.0-canary.f95337b) (2025-10-14)

**Note:** Version bump only for package fte.js





# [3.0.0-canary.cc3b592](https://github.com/vedmalex/fte2/compare/v3.0.0-canary.d509dcd...v3.0.0-canary.cc3b592) (2025-10-14)

**Note:** Version bump only for package fte.js





# [3.0.0-canary.d509dcd](https://github.com/vedmalex/fte2/compare/v3.0.0-canary.ade27ca...v3.0.0-canary.d509dcd) (2025-10-14)

**Note:** Version bump only for package fte.js





# [3.0.0-canary.ade27ca](https://github.com/vedmalex/fte2/compare/v3.0.0-canary.430e6b6...v3.0.0-canary.ade27ca) (2025-10-14)

**Note:** Version bump only for package fte.js





# [3.0.0-canary.430e6b6](https://github.com/vedmalex/fte2/compare/v3.0.0-canary.75702da...v3.0.0-canary.430e6b6) (2025-10-14)

**Note:** Version bump only for package fte.js





# [3.0.0-canary.75702da](https://github.com/vedmalex/fte2/compare/v3.0.0-canary.7bdad5c...v3.0.0-canary.75702da) (2025-10-14)

**Note:** Version bump only for package fte.js





# [3.0.0-canary.7bdad5c](https://github.com/vedmalex/fte2/compare/v3.0.0-canary.1912a68...v3.0.0-canary.7bdad5c) (2025-10-14)

**Note:** Version bump only for package fte.js





# [3.0.0-canary.1912a68](https://github.com/vedmalex/fte2/compare/v3.0.0-canary.527c03b...v3.0.0-canary.1912a68) (2025-10-14)

**Note:** Version bump only for package fte.js





# [3.0.0-canary.527c03b](https://github.com/vedmalex/fte2/compare/v3.0.0-canary.04f699a...v3.0.0-canary.527c03b) (2025-10-14)

**Note:** Version bump only for package fte.js





# [3.0.0-canary.04f699a](https://github.com/vedmalex/fte2/compare/v3.0.0-rc.13-canary.cd48650...v3.0.0-canary.04f699a) (2025-10-14)

**Note:** Version bump only for package fte.js





# [3.0.0-rc.13-canary.cd48650](https://github.com/vedmalex/fte2/compare/v3.0.0-rc.13...v3.0.0-rc.13-canary.cd48650) (2025-10-14)

**Note:** Version bump only for package fte.js





# 3.0.0-rc.13 (2025-10-14)


### Bug Fixes

* **build:** preserve provided output filename with extension to match tests; avoid duplicating .js/.ts ([ba87232](https://github.com/vedmalex/fte2/commit/ba87232ed6964f33bb77954f3453b2f8bbd189ef))
* **templates:** prevent [object Object] in bundles by stringifying and validating core/codeblock outputs; add sourcemap passthrough and proper return types ([0a33173](https://github.com/vedmalex/fte2/commit/0a33173e432b10dff5a059c959b95aa873036d94))


### Features

* **cli:** add --format cjs|esm; route build to ESM singlefile/standalone templates; add esm test ([0d88ccd](https://github.com/vedmalex/fte2/commit/0d88ccdcabf7ce9af22d7c638ccdfd331b37c733))
* **errors:** print code snippet on SWC parse error and keep full .err dump for debugging ([1966372](https://github.com/vedmalex/fte2/commit/196637250ff50f89d1534f7bc3055b1ddab62d41))
* **formatter:** add fte.js-formatter package, rules, CLI; apply formatting to demos ([64497ed](https://github.com/vedmalex/fte2/commit/64497ed13984abdaf7b92d28e519af62bef10256))
* **fte.js:** add fte tagged template helper and export; update templates runtime typing ([73a3c05](https://github.com/vedmalex/fte2/commit/73a3c05b263ce4991ed13d982394c68ae86677e7))
* **templates,async:** add async helpers and tests; awaitable join across MainTemplate/codeblock; browser/standalone async APIs ([fbd810c](https://github.com/vedmalex/fte2/commit/fbd810c7a215ef4b69588254a492a3693b3b525c))
