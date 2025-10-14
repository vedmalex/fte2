# Generic Catalog Migration Script v2.0

## Проблемы оригинального скрипта

Оригинальный `migrate-to-catalog.js` имел следующие ограничения:

### ❌ Жестко заданные правила категоризации
- Фиксированные списки зависимостей в коде
- Невозможно добавить новые категории или правила
- Простое `includes()` matching дает ложные срабатывания

### ❌ Ограниченная поддержка workspace структур
- Только `apps/*/package.json` и `packages/*/package.json`
- Не поддерживает кастомные паттерны (tools, libs, etc.)

### ❌ Примитивное разрешение конфликтов версий
- Выбирает первую версию из списка
- Не учитывает семантику версий (^1.2.3 vs ~1.2.3)

### ❌ Игнорирование типов зависимостей
- Не различает peerDeps, optionalDeps, bundledDeps
- Все зависимости обрабатываются одинаково

## ✅ Решения в Generic версии

### 🔧 Конфигурируемая система категоризации

```json
{
  "categorization": {
    "rules": [
      {
        "category": "runtime",
        "matchers": [
          { "type": "exact", "values": ["react", "vue"] },
          { "type": "contains", "values": ["lodash", "axios"] },
          { "type": "pattern", "pattern": "^@types/", "category": "build" }
        ]
      }
    ]
  }
}
```

**Типы матчеров:**
- `exact` - точное совпадение имени
- `contains` - содержит подстроку
- `startsWith` - начинается с префикса
- `pattern` - регулярное выражение

### 📁 Гибкие workspace паттерны

```json
{
  "workspacePatterns": [
    "packages/*/package.json",
    "apps/*/package.json",
    "tools/*/package.json",
    "libs/*/package.json"
  ]
}
```

### 🏷️ Умное разрешение конфликтов версий

**Стратегии:**
- `semantic-latest` - самая новая семантическая версия
- `latest` - лексикографически последняя
- `first` - первая в списке (как в оригинале)
- `manual` - требует ручного разрешения

```json
{
  "versionConflictResolution": {
    "strategy": "semantic-latest",
    "options": {
      "preferStable": true,
      "allowPreReleases": false
    }
  }
}
```

### 📦 Поддержка типов зависимостей

```json
{
  "dependencyTypes": {
    "include": ["dependencies", "devDependencies", "peerDependencies"],
    "exclude": ["optionalDependencies", "bundledDependencies"]
  }
}
```

## 🚀 Использование

### 1. Генерация конфигурации

```bash
node scripts/migrate-to-catalog-generic.js init-config
```

### 2. Анализ зависимостей

```bash
# С дефолтной конфигурацией
node scripts/migrate-to-catalog-generic.js analyze

# С кастомной конфигурацией
node scripts/migrate-to-catalog-generic.js analyze --config my-config.json
```

### 3. Миграция

```bash
# С дефолтной конфигурацией
node scripts/migrate-to-catalog-generic.js migrate

# С кастомной конфигурацией
node scripts/migrate-to-catalog-generic.js migrate --config my-config.json
```

## 📋 Пример конфигурации

См. `migrate-catalog.config.json` для полного примера конфигурации с:
- 5 категориями каталогов (runtime, build, testing, development, docs)
- Расширенными правилами категоризации
- Семантическим разрешением версий
- Поддержкой дополнительных типов зависимостей

## 🔄 Миграция с оригинального скрипта

1. **Создайте новую конфигурацию:**
   ```bash
   node scripts/migrate-to-catalog-generic.js init-config
   ```

2. **Отредактируйте правила** под ваш проект в `migrate-catalog.config.json`

3. **Протестируйте анализ:**
   ```bash
   node scripts/migrate-to-catalog-generic.js analyze
   ```

4. **Выполните миграцию:**
   ```bash
   node scripts/migrate-to-catalog-generic.js migrate
   ```

## 🎯 Преимущества нового подхода

- **Расширяемость** - добавляйте новые правила без изменения кода
- **Гибкость** - поддержка разных структур monorepo
- **Умность** - семантическое разрешение версий
- **Контроль** - детальная настройка типов зависимостей
- **Безопасность** - валидация конфигурации и стратегий разрешения конфликтов

## 🔍 Сравнение результатов

### Оригинальный скрипт:
```
📦 Found 8 workspace packages
📦 Generated Catalogs:
Runtime Dependencies (catalog):
  fte.js-base: ^3.0.0-canary.ade27ca
  fte.js-parser: ^3.0.0-canary.ade27ca
  ...

build Dependencies:
  typescript: ^5.9.2
  ...
```

### Generic скрипт:
```
📦 Found 10 workspace packages
📦 Generated Catalogs:
Runtime Dependencies (catalog):
  chokidar: ^3.6.0
  commander: ^10.0.1
  fte.js-base: ^3.0.0-canary.ade27ca
  ...

build Dependencies:
  @babel/core: ^7.28.4
  @babel/generator: ^7.28.3
  typescript: ^5.9.2
  ...

development Dependencies:
  prettier: ^3.6.2
```

Generic версия находит больше пакетов, лучше категоризирует зависимости и разрешает конфликты умнее!
