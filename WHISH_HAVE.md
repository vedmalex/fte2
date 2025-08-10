# Wishlist / Nice-to-have improvements

This document tracks non-blocking, high-impact improvements we want to explore next.

## Streaming (options.stream)
- Streaming deindent without full buffering
  - Implement `applyDeindentStream(asyncIterable, numChars?)` to compute common indent on the fly and trim per-line while yielding.
- Backpressure and abort quality
  - Hook to `AbortSignal.addEventListener('abort')` for immediate generator termination (not only at await points).
  - Introduce soft `highWaterMark` for queue to limit memory when producer is faster than consumer.
- First-class chunk streams
  - `runStreamChunks(context, name): AsyncIterable<{ name: string, content: AsyncIterable<string> }>` to avoid array materialization.
  - Merge child chunk streams from partials directly into parent chunk result without intermediate arrays.
- Stream adapters and DX
  - Helpers `toNodeReadable(asyncIterable)` and `toWebReadable(asyncIterable)` for Node/Web Streams interoperability.
  - Callbacks in options: `onChunk`, `onError` for simple consumption without manual loops.
- Types and contracts
  - Strong typings for `runStream` and chunk stream shapes (`ChunkContentStream`), remove `any` in tests.
  - Add `.d.ts` for `stream` and `abort` options across packages.
- Performance
  - Coalesce tiny `out.push` segments into larger chunks (size/time thresholds) to reduce overhead.
  - Benchmarks for sync/async/stream modes with/without chunks.
- Slots/partials behavior in stream
  - Stream string partials directly into current flow; merge child chunk streams seamlessly.
  - "Lazy slot render" option to stream slots as their values arrive.
- Sourcemaps in stream
  - Side-car map builder that aggregates during generation and exposes final map via `onMapReady(map)`; document non-streaming nature of maps.

## Async mode (options.promise)
- Broaden test matrix for mixed thenable/string cases and deep nesting.
- Document guarantees about ordering and error surfacing.

## CLI and examples
- CLI `--stream` mode writing to stdout/files (including multi-file chunk outputs).
- Browser example with Web Streams API and cancellation.

## Tests
- Abort behavior in chunk streams.
- Streaming deindent tests (line-accurate trimming during yield).
- Large-volume streaming with slow consumer to validate memory/backpressure.

## Documentation
- Comparison table of return types: sync vs async vs stream, with/without chunks.
- Clear contracts for each mode and caveats.
