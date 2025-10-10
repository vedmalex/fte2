# Миграция на Bun Catalogs

Этот документ описывает процесс миграции проекта fte.js на использование Bun Catalogs для управления зависимостями.

## Что такое Catalogs?

Catalogs в Bun предоставляют простой способ совместного использования общих версий зависимостей между несколькими пакетами в монорепозитории. Вместо многократного указания одних и тех же версий в каждом пакете воркспейса, вы определяете их один раз в корневом `package.json` и последовательно ссылаетесь на них во всем проекте.

## Структура каталогов

Проект использует два каталога:

### Dev Catalog (`catalog:dev`)
Содержит зависимости разработки:
- **TypeScript и типы**: `typescript`, `@types/*`
- **Тестирование**: `jest`, `jest-config`, `ts-jest`
- **Линтинг и форматирование**: `eslint`, `prettier` и плагины
- **Инструменты разработки**: `ts-node`, `tslib`
- **Управление монорепозиторием**: `lerna`, `nx`

### Runtime Catalog (`catalog:runtime`)
Содержит основные runtime зависимости:
- **Транспиляция**: `@babel/*`, `@swc/*`
- **Работа с файлами**: `chokidar`, `glob`
- **Утилиты**: `lodash`, `commander`
- **Файловая система**: `mem-fs`, `mem-fs-editor`
- **AST обработка**: `ts-morph`
- **Source maps**: `source-map`, `@types/source-map`

### Дополнительные зависимости в Dev Catalog
Дополнительно в dev каталог были добавлены зависимости для сборки и разработки:
- **Сборщики**: `rollup`, `rollup-plugin-ts`, `rollup-plugin-tsconfig-paths`
- **Инструменты**: `@rollup/plugin-replace`, `@total-typescript/ts-reset`, `del-cli`
- **VSCode расширения**: `vscode-languageclient`, `vscode-languageserver`, `vscode-languageserver-textdocument`

## Процесс миграции

### 1. Обновление корневого package.json
- ✅ Добавлены определения каталогов в `workspaces.catalogs`
- ✅ Удалены дублированные зависимости из корневого уровня

### 2. Обновление package.json файлов пакетов
- ✅ `packages/fte.js/package.json` - основные runtime зависимости
- ✅ `packages/fte.js-base/package.json` - source-map зависимости
- ✅ `packages/fte.js-formatter/package.json` - dev зависимости
- ✅ `packages/fte.js-parser/package.json` - rollup и сборочные зависимости
- ✅ `packages/vscode-ftejs-lang/package.json` - vscode расширения зависимости
- ✅ `packages/vscode-ftejs-lang/server/package.json` - серверные зависимости

### 3. Создание миграционного скрипта
- ✅ Создан `scripts/migrate-to-catalogs.js` для автоматизации миграции

## Преимущества миграции

1. **Согласованность версий**: Все пакеты используют одинаковые версии зависимостей
2. **Легкость обновления**: Обновление версии в одном месте влияет на все пакеты
3. **Ясность**: Сразу видно, какие зависимости стандартизированы
4. **Упрощение поддержки**: Меньше дублированного кода в package.json файлах

## Следующие шаги после миграции

1. **Установка зависимостей**:
   ```bash
   bun install
   ```

2. **Тестирование сборки**:
   ```bash
   bun run templates
   bun run lint
   bun run typecheck
   ```

3. **Тестирование пакетов**:
   ```bash
   cd packages/fte.js && bun run test
   cd packages/fte.js-base && bun run test
   cd packages/fte.js-formatter && bun run test
   ```

4. **Обновление CI/CD**: Убедитесь, что скрипты сборки работают с новыми зависимостями

5. **Проверка публикации**: При публикации пакетов Bun автоматически заменит ссылки `catalog:` на реальные версии

## Структура каталогов в package.json

```json
{
  "workspaces": {
    "packages": ["packages/*"],
    "catalogs": {
      "dev": {
        "typescript": "next",
        "jest": "^30.2.0",
        "eslint": "^9.37.0"
        // ... другие dev зависимости
      },
      "runtime": {
        "@babel/core": "^7.28.4",
        "lodash": "^4.17.21",
        "ts-morph": "^27.0.0"
        // ... другие runtime зависимости
      }
    }
  }
}
```

## Использование в пакетах

```json
{
  "dependencies": {
    "lodash": "catalog:runtime",
    "@babel/core": "catalog:runtime"
  },
  "devDependencies": {
    "typescript": "catalog:dev",
    "jest": "catalog:dev"
  }
}
```

## Миграционный скрипт

Для автоматизации миграции используйте:

```bash
node scripts/migrate-to-catalogs.js
```

Скрипт автоматически:
- Находит все package.json файлы в проекте
- Заменяет прямые ссылки на версии на catalog ссылки
- Показывает отчет о проделанных изменениях

## Важные замечания

- **Локфайл обновляется автоматически**: `bun.lockb` будет содержать ссылки на каталоги
- **Публикация работает автоматически**: При `bun publish` ссылки `catalog:` заменяются на реальные версии
- **Обратная совместимость**: Проект остается полностью функциональным для других менеджеров пакетов
- **Гибкость**: Можно комбинировать catalog ссылки с прямыми версиями в одном package.json

## Откат миграции

Если потребуется откатить изменения:

1. Восстановите резервные копии package.json файлов
2. Удалите определения каталогов из корневого package.json
3. Выполните `bun install` для обновления зависимостей

## Поддержка

- Catalogs доступны в Bun 1.0+
- Полная документация: [Bun Docs - Catalogs](https://bun.sh/docs/runtime/bundler#catalogs)
- Актуальная версия Bun рекомендуется для использования этой функциональности
