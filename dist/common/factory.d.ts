import { TemplateBase } from './template';
import { HashType, BlockContent, HashTypeGeneric } from './../common/interfaces';
export declare abstract class TemplateFactoryBase {
    ext: any[];
    cache: HashTypeGeneric<TemplateBase>;
    debug: boolean;
    watch: boolean;
    watchTree: any;
    root: any;
    constructor(config: any);
    register(tpl: TemplateBase, fileName?: string): TemplateBase;
    ensure(fileName: string, absPath?: boolean): TemplateBase;
    blockContent(tpl: TemplateBase): BlockContent;
    preload(fileName?: string): void;
    checkChanges(template?: any, fileName?: any, absPath?: boolean): void;
    load(fileName: string, absPath: boolean): TemplateBase;
    run(ctx: HashType, name: string, absPath?: boolean): string;
}