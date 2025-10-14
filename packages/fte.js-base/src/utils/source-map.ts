import {
  type RawSourceMap,
  SourceMapConsumer,
  SourceMapGenerator,
} from 'source-map'
import {
  type SourceMapOptions,
  type TemplateSegment,
  type TemplateSourceMap,
} from '../types/source-map'

export class TemplateSourceMapGenerator {
  private generator: SourceMapGenerator
  private segments: TemplateSegment[] = []
  private sourceContent: Map<string, string> = new Map()

  constructor(opts: SourceMapOptions = {}) {
    this.generator = new SourceMapGenerator({
      file: opts.file,
      sourceRoot: opts.sourceRoot,
    })
  }

  // Добавить сегмент маппинга
  addSegment(segment: TemplateSegment): void {
    this.segments.push(segment)

    this.generator.addMapping({
      generated: {
        line: segment.generatedLine,
        column: segment.generatedColumn,
      },
      original: {
        line: segment.originalLine,
        column: segment.originalColumn,
      },
      source: segment.source,
      name: segment.name,
    })

    // Сохраняем исходный контент если он есть
    if (segment.content && !this.sourceContent.has(segment.source)) {
      this.sourceContent.set(segment.source, segment.content)
      this.generator.setSourceContent(segment.source, segment.content)
    }
  }

  // Добавить несколько сегментов
  addSegments(segments: TemplateSegment[]): void {
    segments.forEach((segment) => this.addSegment(segment))
  }

  // Получить source map как строку
  toString(): string {
    return this.generator.toString()
  }

  // Получить source map как объект
  toJSON(): TemplateSourceMap {
    const rawMap = this.generator.toJSON() as TemplateSourceMap
    rawMap.template = {
      version: '1.0.0',
      segments: this.segments,
    }
    return rawMap
  }

  // Получить inline source map
  toInlineSourceMap(): string {
    const json = this.toString()
    const base64 = Buffer.from(json).toString('base64')
    return `//# sourceMappingURL=data:application/json;base64,${base64}`
  }

  // Добавить исходный контент
  setSourceContent(source: string, content: string): void {
    this.sourceContent.set(source, content)
    this.generator.setSourceContent(source, content)
  }
}

export class TemplateSourceMapConsumer {
  private consumer: SourceMapConsumer | null = null
  private map: TemplateSourceMap

  constructor(map: string | TemplateSourceMap) {
    this.map = typeof map === 'string' ? JSON.parse(map) : map
  }

  async init(): Promise<void> {
    this.consumer = await new SourceMapConsumer(this.map)
  }

  // Получить оригинальную позицию
  originalPositionFor(line: number, column: number) {
    if (!this.consumer) throw new Error('Consumer not initialized')
    return this.consumer.originalPositionFor({ line, column })
  }

  // Получить сгенерированную позицию
  generatedPositionFor(source: string, line: number, column: number) {
    if (!this.consumer) throw new Error('Consumer not initialized')
    return this.consumer.generatedPositionFor({ source, line, column })
  }

  // Получить исходный контент
  sourceContentFor(source: string): string | null {
    if (!this.consumer) throw new Error('Consumer not initialized')
    return this.consumer.sourceContentFor(source)
  }

  // Получить все исходные файлы
  sources(): string[] {
    if (!this.consumer) throw new Error('Consumer not initialized')
    return (this.map as any).sources || []
  }

  // Получить специфичные для шаблона сегменты
  getTemplateSegments(): TemplateSegment[] {
    return this.map.template?.segments || []
  }

  // Уничтожить consumer
  destroy(): void {
    if (this.consumer) {
      this.consumer.destroy()
    }
  }
}

// Утилиты для работы с source maps
export const sourceMapUtils = {
  // Извлечь inline source map из кода
  extractInlineSourceMap(code: string): string | null {
    const sourceMapRegex =
      /\/\/# sourceMappingURL=data:application\/json;base64,(.+)$/
    const match = code.match(sourceMapRegex)
    if (match && match[1]) {
      return Buffer.from(match[1], 'base64').toString()
    }
    return null
  },

  // Проверить наличие inline source map
  hasInlineSourceMap(code: string): boolean {
    return /\/\/# sourceMappingURL=data:application\/json;base64,/.test(code)
  },

  // Проверить наличие external source map
  hasExternalSourceMap(code: string): boolean {
    return /\/\/# sourceMappingURL=.+\.map/.test(code)
  },

  // Добавить ссылку на external source map
  addExternalSourceMapUrl(code: string, mapUrl: string): string {
    return `${code}\n//# sourceMappingURL=${mapUrl}`
  },

  // Объединить несколько source maps
  async concatenateSourceMaps(maps: RawSourceMap[]): Promise<RawSourceMap> {
    const generator = new SourceMapGenerator()

    for (const map of maps) {
      const consumer = await new SourceMapConsumer(map)
      consumer.eachMapping((mapping) => {
        generator.addMapping({
          generated: {
            line: mapping.generatedLine,
            column: mapping.generatedColumn,
          },
          original: {
            line: mapping.originalLine,
            column: mapping.originalColumn,
          },
          source: mapping.source,
          name: mapping.name,
        })
      })
      consumer.destroy()
    }

    return generator.toJSON()
  },
}
