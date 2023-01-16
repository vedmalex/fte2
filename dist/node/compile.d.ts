/// <reference types="node" />
import templates from '../templates';
import { TemplateFactoryStandalone } from '../standalone/factory';
export declare const F: TemplateFactoryStandalone<any>;
export declare function run(context: any, template: keyof typeof templates): string | {
    name: string;
    content: string;
}[];
export declare function compileLight(content: Buffer | string, optimize: boolean): string;
export declare function compileFull(content: Buffer | string, optimize: boolean): string;
export declare function compileTs(content: Buffer | string, optimize: boolean): string;
export declare function parseFile(content: Buffer | string): import("../parser/parse").CodeBlock;
//# sourceMappingURL=compile.d.ts.map