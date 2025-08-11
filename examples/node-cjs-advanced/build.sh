#!/usr/bin/env bash
set -euo pipefail
DIR=$(cd "$(dirname "$0")" && pwd)
ROOT=$(cd "$DIR/../.." && pwd)

node "$ROOT/packages/fte.js/bin/fte.js" bundle "$DIR/templates" "$DIR/dist" --single --file index --sourcemap --no-inline-map
