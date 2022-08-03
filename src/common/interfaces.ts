import { TemplateFactoryBase } from './factory'
import { createInterface } from 'readline'
export type HashType = {
  [key: string]: any
}

export interface DefaultFactoryOption extends Record<string, any> {
  applyIndent(_str: string, _indent: number | string): string
  escapeIt(text: string): string
}

export type HashTypeGeneric<T> = {
  [key: string]: T
}

export type PartialFunction = (obj: HashType, name: string) => string

export type SlotFunction = (
  name: string,
  content: string | Array<string>,
) => void | string

export type SlotsHash = { [key: string]: Array<string> }

export type ContentFunction = (
  name: string,
  context: HashType,
  content: ContentFunction,
  partial: PartialFunction,
  slot: SlotFunction,
) => string | Array<{ name: string; content: string }>

export type BlockRunFunction<T extends DefaultFactoryOption> = (
  context: HashType,
  content: ContentFunction,
  partial: PartialFunction,
  slot: SlotFunction,
  options: T,
) => string | Array<{ name: string; content: string }>

export type BlockContent<T extends DefaultFactoryOption> = {
  partial: PartialFunction
  content: ContentFunction
  run: BlockRunFunction<T>
  slots: SlotsHash
  slot: SlotFunction
}

export type BlocksHash<T extends DefaultFactoryOption> = HashTypeGeneric<
  BlockRunFunction<T>
>

export type TemplateConfig<T extends DefaultFactoryOption> = {
  source?: string
  name?: string
  absPath?: string
  parent?: string
  options?: Record<string, any>
  blocks?: BlocksHash<T>
  slots?: BlocksHash<T>
  aliases?: HashTypeGeneric<string>
  alias?: Array<string>
  dependency?: HashTypeGeneric<boolean>
  srcCode?: string
  script?: BlockRunFunction<T>
  factory?: TemplateFactoryBase<T>
  compile?: () => void
}
