# create new project

## copy files

- .eslint.js
- jest.config.js
- rollup.config.mjs
- tsconfig.json

добавить зависимости в `package.json`

"devDependencies" :{
  "@rollup/plugin-commonjs": "^24.0.1",
  "@rollup/plugin-json": "^6.0.0",
  "@rollup/plugin-node-resolve": "^15.0.1",
  "@rollup/plugin-replace": "^5.0.2",
  "@total-typescript/ts-reset": "^0.3.7",
  "del-cli": "^5.0.0",
  "jest": "^29.4.3",
  "jest-config": "^29.4.3",
  "rollup": "^3.17.3",
  "rollup-plugin-ts": "^3.2.0",
  "rollup-plugin-tsconfig-paths": "^1.4.0",
  "typescript": "next"
}

добавить в `package.json`

  "main": "./dist/index.js",
  "module": "./module/index.module.js",
  "types": "./dist/index.d.ts",
  "prettier": "../../.prettierrc.js",

добавить `scripts`

  "test": "jest --coverage",
  "prepublish": "rollup -c",
  "build-prod": "rollup -c",
  "watch": "tsc -w --noEmit"
  "build-dev": "tsc"

packages

[x] data-extractor

[] db-connection-pool
[] file-writer
[] generators-client
[] globals
[] loaders
[] meta-codegen
[] metadata-loader
[] schema-loader
[] statemachine
[] transaction

utilities
[] js-schema
[] mongoose-autoincr
[] mongoose-created
[] mongoose-last-modified
[] muri
[] step
[] twostep
