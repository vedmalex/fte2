#!/usr/bin/env bash
set -euo pipefail
DIR=$(cd "$(dirname "$0")" && pwd)
ROOT=$(cd "$DIR/../.." && pwd)

# Bundle demo templates with .nhtml extension
node "$ROOT/packages/fte.js/bin/fte.js" bundle "$ROOT/demo/indent/views" "$DIR/dist" --single --file index --sourcemap --no-inline-map --ext .nhtml

# Run a demo template (graphql.nhtml)
node -e "const { TemplateFactoryStandalone: F } = require('../../packages/fte.js-standalone/dist/TemplateFactoryStandalone.js'); const templates = require('./dist/index.js'); const f=new F(templates); console.log(f.run({}, 'graphql.nhtml'))"
