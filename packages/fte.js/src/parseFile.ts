import { Parser } from 'fte.js-parser'

export function parseFile(content: Buffer | string) {
  return Parser.parse(content.toString())
}
