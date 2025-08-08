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
  // Позиция в сгенерированном коде
  generatedLine: number;
  generatedColumn: number;

  // Позиция в исходном коде
  originalLine: number;
  originalColumn: number;

  // Исходный файл
  source: string;

  // Исходный контент (опционально)
  content?: string;

  // Имя идентификатора (опционально)
  name?: string;
}

export interface TemplateSourceMap extends RawSourceMap {
  // Дополнительные поля специфичные для шаблонизатора
  template?: {
    version: string;
    segments: TemplateSegment[];
  };
}

// Интерфейс для хранения информации о позициях в процессе парсинга
export interface SourceInfo {
  // Текущая позиция в исходном файле
  originalLocation: SourceLocation;

  // Текущая позиция в генерируемом файле
  generatedLocation: Position;

  // Имя исходного файла
  source: string;

  // Контент исходного файла (опционально)
  sourceContent?: string;
}

// Опции для генерации source maps
export interface SourceMapGeneratorOptions {
  file?: string;
  sourceRoot?: string;
  skipValidation?: boolean;
  includeContent?: boolean;
}