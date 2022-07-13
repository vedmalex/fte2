import { TemplateFactoryBase } from './factory'
import { createInterface } from 'readline'
export type HashType = {
  [key: string]: any
}

export interface DefaultFactoryOption extends Record<string, any> {
  applyIndent(_str: string, _indent: number | string): string
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
) => string

export type BlockRunFunction = (
  context: HashType,
  content: ContentFunction,
  partial: PartialFunction,
  slot: SlotFunction,
) => string

export type BlockContent = {
  partial: PartialFunction
  content: ContentFunction
  run: BlockRunFunction
  slots: SlotsHash
  slot: SlotFunction
}

export type BlocksHash = HashTypeGeneric<BlockRunFunction>

export type TemplateConfig<T extends DefaultFactoryOption> = {
  source?: string
  name?: string
  absPath?: string
  parent?: string
  options?: Record<string, any>
  blocks?: BlocksHash
  slots?: BlocksHash
  aliases?: HashTypeGeneric<string>
  alias?: Array<string>
  dependency?: HashTypeGeneric<boolean>
  srcCode?: string
  script?: BlockRunFunction
  factory?: TemplateFactoryBase<T>
  compile?: () => void
}
