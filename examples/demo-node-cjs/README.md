# Demo (Node CJS) using templates from demo/

Build and run:

```bash
./build-and-run.sh
node run-async.js
node run-stream.js
```

- Bundles demo templates from `demo/indent/views` (e.g., `graphql.nhtml`) using the CLI
- Runs the bundled templates with Node CJS runtime (sync/async/stream)
- For stream, converts AsyncIterable to Node Readable via `toNodeReadable`
