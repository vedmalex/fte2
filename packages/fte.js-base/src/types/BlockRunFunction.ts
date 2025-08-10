import { ChunkContent } from './ChunkContent'
import { ContentFunction } from './ContentFunction'
import { DefaultFactoryOption } from './DefaultFactoryOption'
import { PartialFunction } from './PartialFunction'
import { SlotFunction } from './SlotFunction'

export type BlockRunFunction = <T, OPTIONS extends DefaultFactoryOption = DefaultFactoryOption>(
  context: T,
  content: ContentFunction,
  partial: PartialFunction,
  slot: SlotFunction,
  options: OPTIONS,
) => string | Array<ChunkContent>

export type BlockRunFunctionAsync = <T, OPTIONS extends DefaultFactoryOption = DefaultFactoryOption>(
  context: T,
  content: ContentFunction,
  partial: PartialFunction,
  slot: SlotFunction,
  options: OPTIONS,
) => Promise<string | Array<ChunkContent>>
