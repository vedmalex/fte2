# Safe Template Bundle Script

## Проблема

Регенерация шаблонов командой `bun bundle` имела проблему "курицы и яйца": шаблоны используются для генерации самих себя, что приводило к ошибкам вида `[object Object]` в сгенерированных файлах.

## Решение

Создан скрипт `safe-bundle.ts`, который:
1. Генерирует шаблоны в `src.new/` вместо прямой замены `src/`
2. Валидирует структуру сгенерированных файлов
3. Только при успешной валидации заменяет `src/` на `src.new/`

## Исправления, которые НЕОБХОДИМО применить вручную

### 1. TemplateFactory.ts - обработка {code, map} объектов

Файл: `packages/fte.js/src/TemplateFactory.ts`

```typescript
public override runPartial<T>({
  context,
  name,
  absPath,
  options,
  slots,
}: {
  context: T
  name: string
  absPath?: boolean
  options?: OPTIONS
  slots?: SlotsHash
}): string {
  const templ = this.ensure(name, absPath)
  if (!templ.chunks) {
    const bc = this.blockContent(templ, slots)
    const result = bc.run(context, bc.content, bc.partial, bc.slot, {
      ...this.options,
      ...(options ?? {}),
    })
    // Handle both string and {code, map} returns (sourcemap support)
    return typeof result === 'string' ? result : (result as any)?.code ?? ''
  } else {
    throw new Error("cant't use template with chunks as partial")
  }
}
```

### 2. MainTemplate.ts.njs.ts - добавление optional chaining

Файл: `packages/fte.js-templates/src/MainTemplate.ts.njs.ts`

Заменить все обращения к `directives.` на `directives?.`:
- `directives.chunks` → `directives?.chunks`
- `directives.deindent` → `directives?.deindent`
- `directives.requireAs` → `directives?.requireAs`
- и т.д.

### 3. es6module.ts.njs.ts - использование context.core напрямую

Файл: `packages/fte.js-templates/src/es6module.ts.njs.ts`

```typescript
script: function (context, _content, partial, slot, options) {
  var out: Array<string> = []
  out.push("import { TemplateBase } from 'fte.js-base'\n")
  out.push('\n')
  out.push('export default ' + context.core + ';')
  return out.join('')
},
```

## Статус

⚠️ **ВАЖНО**: Автоматическая регенерация шаблонов в текущем виде невозможна из-за циклической зависимости. Требуется дополнительное исследование архитектуры системы шаблонов.

## Рекомендации

1. Не запускать `bun bundle` без предварительной проверки через `safe-bundle.ts`
2. Всегда проверять `src.new/` перед заменой `src/`
3. Сохранить текущую рабочую версию в `src.backup.before-regeneration/`

## Использование скрипта

```bash
cd packages/fte.js-templates
bun scripts/safe-bundle.ts
```

Скрипт покажет результаты валидации и предотвратит замену исходных файлов при обнаружении проблем.

