import { Template } from './template';
import { TemplateFactoryBase } from './../common/factory';
import { HashType, SlotsHash } from './../common/interfaces';
export declare class TemplateFactory extends TemplateFactoryBase {
    load(fileName: string, absPath?: boolean): any;
    preload(): void;
    create(source: string, name?: string): string;
    standalone(source: string): Template;
    run(context: HashType, name: string, absPath?: boolean): string | Array<object>;
    runPartial(context: HashType, name: string, absPath?: boolean, slots?: SlotsHash): string;
    blocksToFiles(context: HashType, name: string, absPath?: boolean): Array<{
        file: string;
        content: string;
    }>;
    express(): (fileName: any, context: any, callback: any) => void;
    clearCache(fn: any, list: any): void;
    checkChanges(template: any, fileName: string, absPath: boolean): void;
}
//# sourceMappingURL=factory.d.ts.map