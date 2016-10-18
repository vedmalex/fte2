import { TemplateFactoryBase } from './../common/factory';
import { HashType } from './../common/interfaces';
export declare class TemplateFactory extends TemplateFactoryBase {
    load(fileName: string, absPath?: boolean): any;
    preload(): void;
    create(source: string, name?: string): string;
    run(context: HashType, name: string, absPath?: boolean): string;
    express(): (fileName: any, context: any, callback: any) => void;
    clearCache(fn: any, list: any): void;
    checkChanges(template: any, fileName: string, absPath: boolean): void;
}
