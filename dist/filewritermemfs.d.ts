import { IFs } from 'memfs';
export declare const temp: import("memfs/lib/volume").Volume;
export declare const result: import("memfs/lib/volume").Volume;
export declare const write: (fs: IFs) => (fn: string, data: string, { format, minify, pretty, }?: {
    format?: boolean;
    minify?: boolean;
    pretty?: boolean;
}) => void;
export declare const read: (fs: IFs) => (fn: string) => void;
export declare const writeFileTemp: (fn: string, data: string, { format, minify, pretty, }?: {
    format?: boolean;
    minify?: boolean;
    pretty?: boolean;
}) => void;
export declare const writeFile: (fn: string, data: string, { format, minify, pretty, }?: {
    format?: boolean;
    minify?: boolean;
    pretty?: boolean;
}) => void;
export declare const readFileTemp: (fn: string) => void;
export declare const readFile: (fn: string) => void;
export declare function commit(): Promise<unknown>;
//# sourceMappingURL=filewritermemfs.d.ts.map