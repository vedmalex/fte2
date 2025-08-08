"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sourceMapUtils = exports.TemplateSourceMapConsumer = exports.TemplateSourceMapGenerator = void 0;
const source_map_1 = require("source-map");
class TemplateSourceMapGenerator {
    constructor(opts = {}) {
        this.segments = [];
        this.sourceContent = new Map();
        this.generator = new source_map_1.SourceMapGenerator({
            file: opts.file,
            sourceRoot: opts.sourceRoot,
        });
    }
    addSegment(segment) {
        this.segments.push(segment);
        this.generator.addMapping({
            generated: {
                line: segment.generatedLine,
                column: segment.generatedColumn
            },
            original: {
                line: segment.originalLine,
                column: segment.originalColumn
            },
            source: segment.source,
            name: segment.name
        });
        if (segment.content && !this.sourceContent.has(segment.source)) {
            this.sourceContent.set(segment.source, segment.content);
            this.generator.setSourceContent(segment.source, segment.content);
        }
    }
    addSegments(segments) {
        segments.forEach(segment => this.addSegment(segment));
    }
    toString() {
        return this.generator.toString();
    }
    toJSON() {
        const rawMap = this.generator.toJSON();
        rawMap.template = {
            version: '1.0.0',
            segments: this.segments
        };
        return rawMap;
    }
    toInlineSourceMap() {
        const json = this.toString();
        const base64 = Buffer.from(json).toString('base64');
        return `//# sourceMappingURL=data:application/json;base64,${base64}`;
    }
    setSourceContent(source, content) {
        this.sourceContent.set(source, content);
        this.generator.setSourceContent(source, content);
    }
}
exports.TemplateSourceMapGenerator = TemplateSourceMapGenerator;
class TemplateSourceMapConsumer {
    constructor(map) {
        this.consumer = null;
        this.map = typeof map === 'string' ? JSON.parse(map) : map;
    }
    async init() {
        this.consumer = await new source_map_1.SourceMapConsumer(this.map);
    }
    originalPositionFor(line, column) {
        if (!this.consumer)
            throw new Error('Consumer not initialized');
        return this.consumer.originalPositionFor({ line, column });
    }
    generatedPositionFor(source, line, column) {
        if (!this.consumer)
            throw new Error('Consumer not initialized');
        return this.consumer.generatedPositionFor({ source, line, column });
    }
    sourceContentFor(source) {
        if (!this.consumer)
            throw new Error('Consumer not initialized');
        return this.consumer.sourceContentFor(source);
    }
    sources() {
        if (!this.consumer)
            throw new Error('Consumer not initialized');
        return this.map.sources || [];
    }
    getTemplateSegments() {
        var _a;
        return ((_a = this.map.template) === null || _a === void 0 ? void 0 : _a.segments) || [];
    }
    destroy() {
        if (this.consumer) {
            this.consumer.destroy();
        }
    }
}
exports.TemplateSourceMapConsumer = TemplateSourceMapConsumer;
exports.sourceMapUtils = {
    extractInlineSourceMap(code) {
        const sourceMapRegex = /\/\/# sourceMappingURL=data:application\/json;base64,(.+)$/;
        const match = code.match(sourceMapRegex);
        if (match && match[1]) {
            return Buffer.from(match[1], 'base64').toString();
        }
        return null;
    },
    hasInlineSourceMap(code) {
        return /\/\/# sourceMappingURL=data:application\/json;base64,/.test(code);
    },
    hasExternalSourceMap(code) {
        return /\/\/# sourceMappingURL=.+\.map/.test(code);
    },
    addExternalSourceMapUrl(code, mapUrl) {
        return `${code}\n//# sourceMappingURL=${mapUrl}`;
    },
    async concatenateSourceMaps(maps) {
        const generator = new source_map_1.SourceMapGenerator();
        for (const map of maps) {
            const consumer = await new source_map_1.SourceMapConsumer(map);
            consumer.eachMapping(mapping => {
                generator.addMapping({
                    generated: {
                        line: mapping.generatedLine,
                        column: mapping.generatedColumn
                    },
                    original: {
                        line: mapping.originalLine,
                        column: mapping.originalColumn
                    },
                    source: mapping.source,
                    name: mapping.name
                });
            });
            consumer.destroy();
        }
        return generator.toJSON();
    }
};
//# sourceMappingURL=source-map.js.map