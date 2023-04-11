import { DefaultFactoryOption } from './DefaultFactoryOption';
import { SlotsHash } from './SlotsHash';
export type RunPartialContext<T, OPTIONS extends DefaultFactoryOption> = {
    context: T;
    name: string;
    absPath?: boolean;
    options?: OPTIONS;
    slots?: SlotsHash;
};
//# sourceMappingURL=RunPartialContext.d.ts.map