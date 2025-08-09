#!/usr/bin/env bash
set -euo pipefail
DIR=$(cd "$(dirname "$0")" && pwd)
ROOT=$(cd "$DIR/../.." && pwd)

node "$ROOT/packages/fte.js/bin/fte.js" bundle "$DIR/templates" "$DIR/dist" --single --file index --sourcemap --no-inline-map
node -e "const { TemplateFactoryStandalone: F } = require('../../packages/fte.js-standalone/dist/TemplateFactoryStandalone.js'); const templates = require('./dist/index.js'); const f=new F(templates); console.log(f.run({name:'world'}, 'hello.njs'))"
