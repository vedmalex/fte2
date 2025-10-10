import { type RawSourceMap } from 'source-map';
import { type SourceMapOptions, type TemplateSegment, type TemplateSourceMap } from '../types/source-map';
export declare class TemplateSourceMapGenerator {
    private generator;
    private segments;
    private sourceContent;
    constructor(opts?: SourceMapOptions);
    addSegment(segment: TemplateSegment): void;
    addSegments(segments: TemplateSegment[]): void;
    toString(): string;
    toJSON(): TemplateSourceMap;
    toInlineSourceMap(): string;
    setSourceContent(source: string, content: string): void;
}
export declare class TemplateSourceMapConsumer {
    private consumer;
    private map;
    constructor(map: string | TemplateSourceMap);
    init(): Promise<void>;
    originalPositionFor(line: number, column: number): import("source-map").NullableMappedPosition;
    generatedPositionFor(source: string, line: number, column: number): import("source-map").NullablePosition;
    sourceContentFor(source: string): string | null;
    sources(): string[];
    getTemplateSegments(): TemplateSegment[];
    destroy(): void;
}
export declare const sourceMapUtils: {
    extractInlineSourceMap(code: string): string | null;
    hasInlineSourceMap(code: string): boolean;
    hasExternalSourceMap(code: string): boolean;
    addExternalSourceMapUrl(code: string, mapUrl: string): string;
    concatenateSourceMaps(maps: RawSourceMap[]): Promise<RawSourceMap>;
};
//# sourceMappingURL=source-map.d.ts.map