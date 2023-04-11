import { BlockRunFunction } from './BlockRunFunction'
import { ContentFunction } from './ContentFunction'
import { DefaultFactoryOption } from './DefaultFactoryOption'
import { PartialFunction } from './PartialFunction'
import { SlotFunction } from './SlotFunction'
import { SlotsHash } from './SlotsHash'

export type BlockContent<OPTIONS extends DefaultFactoryOption> = {
  partial: PartialFunction
  content: ContentFunction
  run: BlockRunFunction
  slots: SlotsHash
  slot: SlotFunction
  options: OPTIONS
}
