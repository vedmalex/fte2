import { Parser } from '../parser/parse'

export function parseFile(content: Buffer | string) {
  return Parser.parse(content.toString())
}
