export type ChunkContent = { name: string; content: string }

// Experimental: stream shape for chunk content in stream mode
export type ChunkContentStream = { name: string; content: AsyncIterable<string> }
