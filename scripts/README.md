# Инструменты Управления Монорепозиторием

Этот набор скриптов обеспечивает полную поддержку современного монорепозитория с использованием Bun Catalogs и Lerna публикации.

## 📦 Доступные скрипты

### 1. **clean.ts** - Умная очистка проекта
### 2. **dependency-compatibility-manager.js** - Совместимость с Lerna
### 3. **publish-with-params.js** - Расширенная публикация
### 4. **migrate-to-catalog.js** - Миграция в Catalogs

## 🚀 Быстрое использование

### Подготовка к публикации
```bash
# Подготовить зависимости для Lerna
npm run deps:backup

# Опубликовать пакеты
npm run publish

# Восстановить зависимости после публикации
npm run deps:restore
```

### Работа с каталогами
```bash
# Проанализировать зависимости
npm run catalog:analyze

# Выполнить миграцию в catalogs
npm run catalog:migrate
```

---

## 🔧 Подробное описание скриптов

### 1. clean.ts - Умная очистка проекта

**Назначение:** Современная утилита для очистки временных файлов с поддержкой Bun.

**Особенности:**
- ✅ Безопасная очистка с защитой важных файлов
- ✅ Dry-run режим для предварительного просмотра
- ✅ Подробные логи операций
- ✅ Кастомные паттерны очистки

**Использование:**
```bash
# Основные команды
bun run scripts/clean.ts                    # Стандартная очистка
bun run scripts/clean.ts --dry-run          # Показать что будет удалено
bun run scripts/clean.ts --verbose          # Подробная очистка с логами

# Кастомные паттерны
bun run scripts/clean.ts --patterns "dist,*.log,build"
```

### 2. dependency-compatibility-manager.js - Совместимость Bun + Lerna

**Назначение:** Решает проблему несовместимости между Bun Catalogs и Lerna publish.

**Проблема:** Lerna не понимает современные спецификации Bun:
- `catalog:*` - централизованное управление версиями
- `workspace:*` - автоматическое разрешение локальных пакетов

**Решение:** Автоматический backup/restore workflow:
1. **Backup & Resolve**: Сохраняет оригиналы и заменяет на конкретные версии
2. **Restore**: Восстанавливает оригинальные зависимости после публикации

**Использование:**
```bash
# Подготовка к публикации
node scripts/dependency-compatibility-manager.js backup-and-resolve

# Восстановление после публикации
node scripts/dependency-compatibility-manager.js restore

# Синхронизация версий с lerna.json
node scripts/dependency-compatibility-manager.js sync-versions
```

### 3. publish-with-params.js - Расширенная публикация

**Назначение:** Гибкая публикация пакетов через Lerna с расширенными параметрами.

**Особенности:**
- 🎯 Публикация конкретных версий
- 🚀 Canary релизы с автогенерацией
- 🔧 Кастомные registry и dist-tag
- ⚡ Автоматическая подготовка зависимостей

**Использование:**
```bash
# Публикация конкретной версии
node scripts/publish-with-params.js 1.2.3

# Canary публикация
node scripts/publish-with-params.js --canary

# С кастомными параметрами
node scripts/publish-with-params.js 1.2.3 --registry https://npm.example.com --dist-tag beta
```

### 4. migrate-to-catalog.js - Миграция в Catalogs

**Назначение:** Автоматическая миграция зависимостей в централизованную структуру Bun Catalogs.

**Особенности:**
- 📊 Анализ зависимостей без изменений
- 🔄 Автоматическая группировка по категориям
- ✅ Разрешение конфликтов версий
- 🔗 Создание catalog структуры в root package.json

**Использование:**
```bash
# Анализ зависимостей
node scripts/migrate-to-catalog.js analyze

# Миграция в catalog структуру
node scripts/migrate-to-catalog.js migrate
```

## 🔄 Рабочий процесс публикации

### Стандартный процесс

```bash
# 1. Подготовка зависимостей
npm run deps:backup
# 🔄 dependencies: react: catalog: → ^18.2.0

# 2. Публикация через Lerna
npm run publish
# 📦 Publishing packages with Lerna...

# 3. Восстановление зависимостей
npm run deps:restore
# ✅ Restored: packages/utils/package.json
```

### Расширенный процесс

```bash
# 1. Анализ и миграция в catalogs (если нужно)
npm run catalog:analyze
npm run catalog:migrate

# 2. Синхронизация версий
npm run deps:sync-versions

# 3. Публикация конкретной версии
node scripts/publish-with-params.js 1.2.3 --force-publish
```

## 🔒 Безопасность

- **Полный backup** всех изменений перед публикацией
- **Автоматическое восстановление** при ошибках
- **Сохранение критических полей** (version, gitHead, publishConfig)
- **Валидация зависимостей** перед публикацией

## 🎯 Интеграция с CI/CD

```yaml
# GitHub Actions
- name: Install dependencies
  run: bun install

- name: Build all packages
  run: bun run build:all

- name: Run tests
  run: bun run test

- name: Prepare for Lerna publish
  run: npm run deps:backup

- name: Publish with Lerna
  run: node scripts/publish-with-params.js ${{ github.event.inputs.version }} --yes

- name: Restore dependencies
  run: npm run deps:restore
  if: always()
```

## 📊 Поддерживаемые форматы зависимостей

### Catalog Dependencies
- `"catalog:"` → Разрешается из основного каталога
- `"catalog:build"` → Разрешается из именованного каталога "build"
- `"catalog:testing"` → Разрешается из именованного каталога "testing"

### Workspace Dependencies
- `"workspace:*"` → Заменяется на текущую версию пакета
- `"workspace:^1.0.0"` → Сохраняется как `"^1.0.0"`

## 🚨 Важные замечания

1. **Всегда запускайте `restore` после публикации** для поддержания catalog:* ссылок
2. **Backup файлы создаются автоматически** - не удаляйте их вручную
3. **Версии синхронизируются с lerna.json** для консистентности монорепозитория
4. **CI/CD пайплайны должны включать restore шаг** даже при ошибках публикации

Этот инструментарий обеспечивает надежную работу современного монорепозитория с Bun Catalogs и Lerna публикацией без необходимости миграции всей инфраструктуры.
