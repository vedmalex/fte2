import { TemplateBase } from './template';
import { HashType, BlockContent, HashTypeGeneric, SlotsHash, DefaultFactoryOption } from './../common/interfaces';
export declare const DefaultFactoryOptions: DefaultFactoryOption;
export declare abstract class TemplateFactoryBase<T extends DefaultFactoryOption> {
    ext: Array<string>;
    cache: HashTypeGeneric<TemplateBase<T>>;
    debug: boolean;
    watch: boolean;
    watchTree: any;
    root: any;
    options: T;
    constructor(config?: {
        root?: string | Array<string>;
        debug?: boolean;
        watch?: boolean;
        ext?: Array<string>;
        preload?: boolean;
        options?: T;
    });
    register(tpl: TemplateBase<T>, fileName?: string): TemplateBase<T>;
    ensure(fileName: string, absPath?: boolean): TemplateBase<T>;
    blockContent(tpl: TemplateBase<T>, slots?: SlotsHash): BlockContent<T>;
    preload(fileName?: string): void;
    checkChanges(template?: any, fileName?: any, absPath?: boolean): void;
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