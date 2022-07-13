import { Template } from './template';
import { TemplateFactoryBase } from './../common/factory';
import { DefaultFactoryOption, HashType, SlotsHash } from './../common/interfaces';
export declare class TemplateFactory<T extends DefaultFactoryOption> extends TemplateFactoryBase<T> {
    load(fileName: string, absPath?: boolean): any;
    preload(): void;
    create(source: string, name?: string): string;
    standalone(source: string): Template<T>;
    run<T extends Record<string, any>>({ context, name, absPath, options, slots, }: {
        context: HashType;
        name: string;
        absPath?: boolean;
        options?: T;
        slots?: SlotsHash;
    }): string | Array<object>;
    runPartial<T extends Record<string, any>>({ context, name, absPath, options, slots, }: {
        context: HashType;
        name: string;
        absPath?: boolean;
        options?: T;
        slots?: SlotsHash;
    }): string;
    blocksToFiles(context: HashType, name: string, absPath?: boolean): Array<{
        file: string;
        content: string;
    }>;
    express(): (fileName: any, context: any, callback: any) => void;
    clearCache(fn: any, list: any): void;
    checkChanges(template: any, fileName: string, absPath: boolean): void;
}
//# sourceMappingURL=factory.d.ts.map