import { HashType } from './interfaces';
export declare function escapeIt(text: string): string;
export declare function applyDeindent(str: string | Array<string>, numChars: number | string): string | string[];
export declare function applyIndent(str: any | Array<string>, _indent: number | string): string | any[];
export declare function set(data: HashType, path: string, value: any): void;
export declare function get(data: HashType, path: string): any;
export declare function merge(a: HashType, b: HashType, property: string): void;
//# sourceMappingURL=helpers.d.ts.map