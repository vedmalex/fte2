import { TemplateBase } from './template';
import { HashType, BlockContent, HashTypeGeneric, SlotsHash, DefaultFactoryOption } from './../common/interfaces';
export declare const DefaultFactoryOptions: DefaultFactoryOption;
export interface FactoryConfig<T> {
    root?: string | Array<string>;
    ext?: Array<string>;
    preload?: boolean;
    options?: T;
}
export declare abstract class TemplateFactoryBase<T extends DefaultFactoryOption> {
    ext: Array<string>;
    cache: HashTypeGeneric<TemplateBase<T>>;
    root: any;
    options: T;
    constructor(config?: FactoryConfig<T>);
    register(tpl: TemplateBase<T>, fileName?: string): TemplateBase<T>;
    ensure(fileName: string, absPath?: boolean): TemplateBase<T>;
    blockContent(tpl: TemplateBase<T>, slots?: SlotsHash): BlockContent<T>;
    preload(fileName?: string): void;
    load(fileName: string, absPath: boolean): TemplateBase<T>;
    run<T extends Record<string, any>>(context: HashType, name: string): string | Array<{
        name: string;
        content: string;
    }>;
    runPartial<T extends Record<string, any>>({ context, name, absPath, options, slots, }: {
        context: HashType;
        name: string;
        absPath?: boolean;
        options: T;
        slots?: SlotsHash;
    }): string;
}
//# sourceMappingURL=factory.d.ts.map