import { RawSourceMap, Position } from 'source-map';
export interface SourceLocation {
    source: string;
    line: number;
    column: number;
}
export interface SourceMapOptions {
    sourceMap?: boolean;
    inline?: boolean;
    sourceRoot?: string;
    file?: string;
}
export interface TemplateSourceLocation {
    start: Position;
    end: Position;
    source: string;
    content?: string;
}
export interface TemplateSegment {
    generatedLine: number;
    generatedColumn: number;
    originalLine: number;
    originalColumn: number;
    source: string;
    content?: string;
    name?: string;
}
export interface TemplateSourceMap extends RawSourceMap {
    template?: {
        version: string;
        segments: TemplateSegment[];
    };
}
export interface SourceInfo {
    originalLocation: SourceLocation;
    generatedLocation: Position;
    source: string;
    sourceContent?: string;
}
export interface SourceMapGeneratorOptions {
    file?: string;
    sourceRoot?: string;
    skipValidation?: boolean;
    includeContent?: boolean;
}
//# sourceMappingURL=source-map.d.ts.map