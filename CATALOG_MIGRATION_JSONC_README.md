# JSONC Support - Конфигурации с комментариями

## 🎉 JSONC (JSON with Comments) Поддержка

Теперь все скрипты миграции поддерживают **JSONC** - JSON файлы с комментариями в стиле JavaScript/TypeScript!

```jsonc
{
  // Workspace паттерны для поиска package.json файлов
  "workspacePatterns": [
    "packages/*/package.json",
    "apps/*/package.json"
  ],

  // Mapping типов зависимостей на категории каталогов
  "dependencyTypeMapping": {
    "dependencies": "catalog",      // runtime зависимости
    "devDependencies": "development", // dev зависимости
    "peerDependencies": "catalog"  // peer зависимости (тоже runtime)
  },

  // Переопределения для специфических пакетов
  "overrides": {
    // TypeScript в отдельную категорию
    "typescript": "build",
    // Type definitions в build
    "@types/node": "build"
  }
}
```

## ✨ Преимущества JSONC

- ✅ **Документированные конфигурации** - комментарии объясняют назначение каждой настройки
- ✅ **Примеры использования** - комментарии показывают как добавлять переопределения
- ✅ **Самодокументируемый код** - не нужно смотреть в документацию
- ✅ **Безопасность** - не ломается при копировании примеров из комментариев

## 📁 Поддерживаемые файлы

- `migrate-catalog-simple.config.jsonc` - Простая версия с комментариями
- `migrate-catalog.config.jsonc` - Generic версия с подробными комментариями

## 🔧 Как работает парсер JSONC

Скрипты автоматически:
1. **Читают файл** с комментариями
2. **Удаляют комментарии** (текст после `//`)
3. **Парсят чистый JSON**
4. **Применяют конфигурацию**

## 📝 Примеры комментариев

### Простая версия:
```jsonc
{
  // Workspace паттерны для поиска package.json файлов
  "workspacePatterns": [
    "packages/*/package.json",
    "apps/*/package.json"
  ],

  // Переопределения для специфических пакетов
  "overrides": {
    // Добавьте сюда пакеты, которые нужно переопределить
  }
}
```

### Generic версия:
```jsonc
{
  // Правила категоризации зависимостей
  "categorization": {
    "rules": [
      {
        "category": "runtime",
        "matchers": [
          {
            "type": "exact",        // Точное совпадение имени
            "values": ["react", "vue"]
          },
          {
            "type": "contains",     // Содержит подстроку
            "values": ["lodash", "axios"]
          },
          {
            "type": "pattern",      // Регулярное выражение
            "pattern": "^@types/",
            "category": "build"     // Переопределение категории
          }
        ]
      }
    ]
  }
}
```

## 🚀 Использование

```bash
# Простая версия с JSONC
node scripts/migrate-to-catalog-simple.js analyze

# Generic версия с JSONC
node scripts/migrate-to-catalog-generic.js analyze

# Генерация новой конфигурации с комментариями
node scripts/migrate-to-catalog-simple.js init-config
```

## 🎯 Результат

Теперь конфигурационные файлы стали:
- **Читабельными** - комментарии объясняют каждую опцию
- **Самодокументируемыми** - примеры использования прямо в файле
- **Безопасными** - можно копировать примеры из комментариев без риска сломать JSON
- **Профессиональными** - выглядят как настоящие конфигурационные файлы проектов

JSONC делает конфигурации миграции **намного более удобными для использования и поддержки**! 🎊
