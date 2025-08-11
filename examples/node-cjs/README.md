# Node CJS example

- Build and run:

```bash
./build-and-run.sh
```

- Demonstrates:
  - CLI bundling (CJS singlefile) with sourcemaps
  - Runtime `run` (sync)
  - Update to try async/stream:

```bash
node -e "const { TemplateFactoryStandalone: F } = require('../../packages/fte.js-standalone/dist/TemplateFactoryStandalone.js'); const templates = require('./dist/index.js'); const f=new F(templates); (async () => { console.log(await f.runAsync({name: Promise.resolve('async')}, 'hello.njs')) })()"

node -e "const { TemplateFactoryStandalone: F } = require('../../packages/fte.js-standalone/dist/TemplateFactoryStandalone.js'); const templates = require('./dist/index.js'); const f=new F(templates); f.options={...f.options, stream:true}; (async () => { for await (const s of f.runStream({name: 'stream'}, 'hello.njs')) process.stdout.write(s) })()"
```
