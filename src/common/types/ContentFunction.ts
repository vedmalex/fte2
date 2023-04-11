import { ChunkContent } from './ChunkContent'
import { PartialFunction } from './PartialFunction'
import { SlotFunction } from './SlotFunction'

export type ContentFunction = <T>(
  name: string,
  context: T,
  content: ContentFunction,
  partial: PartialFunction,
  slot: SlotFunction,
) => string | Array<ChunkContent>
