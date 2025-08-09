#!/usr/bin/env bash
set -euo pipefail
DIR=$(cd "$(dirname "$0")" && pwd)
ROOT=$(cd "$DIR/../.." && pwd)

node "$ROOT/packages/fte.js/bin/fte.js" bundle "$DIR/templates" "$DIR/dist" --single --file index --format esm
node --input-type=module -e "import templates from './examples/node-esm/dist/index.js'; import { TemplateFactoryStandalone as Factory } from './packages/fte.js-standalone/dist/TemplateFactoryStandalone.js'; const F=new Factory(templates); console.log(F.run({name:'world'}, 'hello.njs'))" 
