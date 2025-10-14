# Simple Catalog Migration Script v3.0

## 🎯 Простой и логичный подход

Вместо сложных правил категоризации по именам пакетов, используем **семантику package.json**:

- **`dependencies`** → `runtime` (catalog)
- **`devDependencies`** → `development`
- **`peerDependencies`** → `runtime` (catalog)

## 🚀 Быстрый старт

```bash
# Анализ зависимостей
node scripts/migrate-to-catalog-simple.js analyze

# Миграция в catalogs
node scripts/migrate-to-catalog-simple.js migrate
```

## 📊 Результаты анализа

**До (generic версия):**
- `@types/*` пакеты → build
- `prettier` → development
- `typescript` → build
- Сложные правила на 200 строк JSONC

**После (simple версия):**
- `@types/*` пакеты → development (потому что они в devDependencies)
- `prettier` → catalog (если где-то в dependencies) или development
- `typescript` → development (потому что он в devDependencies)
- Минимум конфигурации в 45 строк JSONC

## 🔧 Переопределения

Если нужно переопределить категорию для специфических пакетов:

```json
{
  "overrides": {
    "typescript": "build",
    "@types/node": "build",
    "vitest": "testing"
  }
}
```

## 📈 Преимущества

- ✅ **Логично** - использует семантику package.json
- ✅ **Просто** - минимум конфигурации
- ✅ **Надежно** - не зависит от имен пакетов
- ✅ **Быстро** - не нужно угадывать категории

## 🎯 Когда использовать

- Когда структура зависимостей в вашем проекте соответствует стандартам
- Когда не нужно сложное переопределение категорий
- Когда важна простота и надежность

## 🔄 Сравнение версий

| Аспект | Original | Generic v2 | Simple v3 |
|--------|----------|------------|-----------|
| Логика категоризации | Жесткий код | Сложные правила | Семантика package.json |
| Конфигурация | 0 строк | 195 строк | 35 строк |
| Надежность | Низкая | Средняя | Высокая |
| Скорость | Быстрая | Средняя | Быстрая |
| Гибкость | Нет | Высокая | Средняя |

**Рекомендация:** Используйте **Simple v3** для большинства проектов!
