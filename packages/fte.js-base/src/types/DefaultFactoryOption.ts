export interface DefaultFactoryOption {
  applyIndent(_str: string, _indent: number | string): string
  applyIndent(_str: Array<string>, _indent: number | string): Array<string>
  applyDeindent(str: string, numChars: number | string): string
  applyDeindent(str: Array<string>, numChars: number | string): Array<string>
  // Streaming deindent: trims indentation on the fly while yielding
  applyDeindentStream?(source: AsyncIterable<string>, numChars?: number | string): AsyncIterable<string>
  escapeIt(text: string): string
  // Source map related options (optional)
  sourceMap?: boolean
  inline?: boolean
  sourceRoot?: string
  // Name of generated output file (used in map.file and URL)
  sourceFile?: string
  // Streaming options (optional)
  stream?: boolean
  abort?: any
}
