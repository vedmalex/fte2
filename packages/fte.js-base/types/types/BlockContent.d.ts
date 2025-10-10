import { BlockRunFunction, BlockRunFunctionAsync } from './BlockRunFunction';
import { ContentFunction } from './ContentFunction';
import { DefaultFactoryOption } from './DefaultFactoryOption';
import { PartialFunction } from './PartialFunction';
import { SlotFunction } from './SlotFunction';
import { SlotsHash } from './SlotsHash';
export type BlockContent<OPTIONS extends DefaultFactoryOption = DefaultFactoryOption> = {
    partial: PartialFunction;
    content: ContentFunction;
    run: BlockRunFunction;
    runAsync?: BlockRunFunctionAsync;
    slots: SlotsHash;
    slot: SlotFunction;
    options: OPTIONS;
};
//# sourceMappingURL=BlockContent.d.ts.map