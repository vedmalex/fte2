import { FSWatcher } from 'chokidar';
import { DefaultFactoryOption, SlotsHash, TemplateBase, TemplateFactoryBase } from 'fte.js-base';
export declare class TemplateFactory<OPTIONS extends DefaultFactoryOption> extends TemplateFactoryBase<OPTIONS> {
    watchList: Array<string>;
    watcher?: FSWatcher;
    load(fileName: string, absPath?: boolean): any;
    preload(): void;
    standalone(source: string): any;
    create(source: string, name?: string): string;
    run<T>(context: T, name: string, absPath?: boolean): any;
    runPartial<T>({ context, name, absPath, options, slots, }: {
        context: T;
        name: string;
        absPath?: boolean;
        options?: OPTIONS;
        slots?: SlotsHash;
    }): string;
    express(): <T>(fileName: string, context: T, callback: any) => void;
    clearCache(template: TemplateBase<OPTIONS>): void;
    ensure(fileName: string, absPath?: boolean): TemplateBase<OPTIONS>;
}
//# sourceMappingURL=TemplateFactory.d.ts.map