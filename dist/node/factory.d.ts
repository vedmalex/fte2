import { FactoryConfig, TemplateFactoryBase } from './../common/factory';
import { FSWatcher } from 'chokidar';
import { DefaultFactoryOption, HashType, SlotsHash } from './../common/interfaces';
import { TemplateBase } from 'src/common/template';
export interface NodeFactoryConfig<T> extends FactoryConfig<T> {
    watch?: boolean;
}
export declare class TemplateFactory<T extends DefaultFactoryOption> extends TemplateFactoryBase<T> {
    watch: boolean;
    watchList: any[];
    watcher: FSWatcher;
    constructor(config?: NodeFactoryConfig<T>);
    load(fileName: string, absPath?: boolean): any;
    preload(): void;
    standalone(source: string): any;
    create(source: string, name?: string): string;
    run<T extends Record<string, any>>(context: HashType, name: string, absPath?: boolean): any;
    runPartial<T extends Record<string, any>>({ context, name, absPath, options, slots, }: {
        context: HashType;
        name: string;
        absPath?: boolean;
        options?: T;
        slots?: SlotsHash;
    }): string;
    express(): (fileName: any, context: any, callback: any) => void;
    clearCache(list: any): void;
    ensure(fileName: string, absPath?: boolean): TemplateBase<T>;
}
//# sourceMappingURL=factory.d.ts.map