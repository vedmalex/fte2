# Demo (Node ESM) using templates from demo/

Build and run:

```bash
./build-and-run.sh
node --input-type=module run-async.mjs
node --input-type=module run-stream.mjs
```

- Bundles `demo/indent/views` (e.g., `graphql.nhtml`) to ESM bundle
- Runs with Node ESM runtime (sync/async/stream)
