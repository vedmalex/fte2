export interface DefaultFactoryOption {
  applyIndent(_str: string, _indent: number | string): string
  applyIndent(_str: Array<string>, _indent: number | string): Array<string>
  applyDeindent(str: string, numChars: number | string): string
  applyDeindent(str: Array<string>, numChars: number | string): Array<string>
  escapeIt(text: string): string
}
