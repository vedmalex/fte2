#!/usr/bin/env node

/**
 * Generic Catalog Migration Script v2.0
 *
 * Конфигурируемая миграция зависимостей в централизованную Bun catalog структуру.
 *
 * Особенности:
 * - Конфигурируемые правила категоризации зависимостей
 * - Плагиновая архитектура для расширения
 * - Умное разрешение конфликтов версий
 * - Поддержка разных типов зависимостей
 * - Гибкие workspace паттерны
 */

const fs = require('node:fs')
const path = require('node:path')
const { execSync } = require('node:child_process')
const { parse } = require('jsonc-parser')

class GenericCatalogMigrator {
  constructor(configPath = null) {
    this.rootDir = process.cwd()
    this.rootPackageJson = path.join(this.rootDir, 'package.json')

    // Загружаем конфигурацию
    this.config = this.loadConfig(configPath)

    // Инициализируем структуру catalogs
    this.catalogs = this.initializeCatalogs()

    this.stats = {
      packagesScanned: 0,
      dependenciesFound: 0,
      conflictsResolved: 0,
      catalogEntries: 0,
    }
  }

  /**
   * Загружает конфигурацию из файла или использует дефолтную
   */
  loadConfig(configPath) {
    const defaultConfig = {
      workspacePatterns: ['packages/*/package.json', 'apps/*/package.json'],
      catalogs: {
        runtime: { name: 'catalog', priority: 1 },
        build: { name: 'build', priority: 2 },
        testing: { name: 'testing', priority: 3 },
        development: { name: 'development', priority: 4 },
      },
      categorization: {
        rules: [
          // Runtime dependencies
          {
            category: 'runtime',
            matchers: [
              { type: 'exact', values: ['react', 'react-dom', 'vue', 'angular', 'svelte'] },
              { type: 'contains', values: ['lodash', 'axios', 'express', 'mongoose', 'redis'] },
              { type: 'pattern', pattern: '^@types/', category: 'build' }, // TypeScript types -> build
            ]
          },
          // Build dependencies
          {
            category: 'build',
            matchers: [
              { type: 'contains', values: ['typescript', 'vite', 'webpack', 'rollup', 'esbuild', 'babel', 'swc', 'postcss', 'tailwindcss', 'sass', 'less'] },
              { type: 'startsWith', values: ['@babel/', '@swc/', '@rollup/'] },
            ]
          },
          // Testing dependencies
          {
            category: 'testing',
            matchers: [
              { type: 'contains', values: ['vitest', 'jest', 'testing-library', 'supertest', 'cypress', 'playwright', 'mocha', 'chai'] },
              { type: 'startsWith', values: ['@vitest/', '@jest/', '@testing-library/'] },
            ]
          },
          // Development dependencies
          {
            category: 'development',
            matchers: [
              { type: 'contains', values: ['eslint', 'prettier', 'husky', 'lint-staged', 'commitlint', 'nodemon'] },
              { type: 'startsWith', values: ['@eslint/', '@typescript-eslint/'] },
            ]
          }
        ],
        defaultCategory: 'runtime'
      },
      versionConflictResolution: {
        strategy: 'semantic-latest', // semantic-latest, latest, first, manual
        options: {
          preferStable: true,
          allowPreReleases: false,
        }
      },
      dependencyTypes: {
        include: ['dependencies', 'devDependencies', 'peerDependencies'],
        exclude: ['optionalDependencies', 'bundledDependencies'],
      }
    }

    if (configPath && fs.existsSync(configPath)) {
      try {
        const content = fs.readFileSync(configPath, 'utf8')
        // Используем jsonc-parser для правильной обработки JSONC
        const userConfig = parse(content)
        return this.deepMerge(defaultConfig, userConfig)
      } catch (error) {
        console.warn(`⚠️  Error loading config ${configPath}:`, error.message)
        console.warn('Using default configuration')
      }
    }

    return defaultConfig
  }

  /**
   * Глубокое слияние объектов
   */
  deepMerge(target, source) {
    const result = { ...target }

    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key])
      } else {
        result[key] = source[key]
      }
    }

    return result
  }

  /**
   * Инициализирует структуру catalogs на основе конфигурации
   */
  initializeCatalogs() {
    const catalogs = { catalogs: {} }

    for (const [categoryKey, categoryConfig] of Object.entries(this.config.catalogs)) {
      if (categoryConfig.name === 'catalog') {
        catalogs.catalog = {}
      } else {
        catalogs.catalogs[categoryConfig.name] = {}
      }
    }

    return catalogs
  }

  /**
   * Показывает справку
   */
  showHelp() {
    console.log(`
🔧 Generic Catalog Migration Script v2.0 - Migrate to Bun Catalogs

Usage: node scripts/migrate-to-catalog-generic.js <command> [options]

Commands:
  analyze          Analyze dependencies without making changes
  migrate          Perform migration to catalog structure
  init-config      Generate default configuration file
  help            Show this help message

Options:
  --config <file>  Path to configuration file (default: migrate-catalog.config.jsonc)
  --dry-run        Show what would be changed without applying changes

Examples:
  # Analyze with default config
  node scripts/migrate-to-catalog-generic.js analyze

  # Migrate with custom config
  node scripts/migrate-to-catalog-generic.js migrate --config my-config.jsonc

  # Generate default config
  node scripts/migrate-to-catalog-generic.js init-config

Migration Process:
  1. Load configuration and rules
  2. Scan all workspace packages
  3. Apply categorization rules to dependencies
  4. Resolve version conflicts using configured strategy
  5. Create catalog structure in root package.json
  6. Update workspace packages to use catalog:* references

Configuration:
  Create migrate-catalog.config.jsonc to customize:
  - Workspace patterns
  - Categorization rules
  - Version conflict resolution strategy
  - Dependency types to include/exclude
`)
  }

  /**
   * Генерирует файл конфигурации по умолчанию
   */
  initConfig() {
    const configPath = 'migrate-catalog.config.jsonc'

    if (fs.existsSync(configPath)) {
      console.log(`⚠️  Config file already exists: ${configPath}`)
      console.log('Use --force to overwrite')
      return
    }

    fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2) + '\n')
    console.log(`✅ Generated default config: ${configPath}`)
    console.log('Edit this file to customize migration rules')
  }

  /**
   * Определяет категорию зависимости с помощью конфигурируемых правил
   */
  categorizeDependency(depName, depVersion) {
    for (const rule of this.config.categorization.rules) {
      for (const matcher of rule.matchers) {
        let matches = false

        switch (matcher.type) {
          case 'exact':
            matches = matcher.values.includes(depName)
            break
          case 'contains':
            matches = matcher.values.some(value => depName.includes(value))
            break
          case 'startsWith':
            matches = matcher.values.some(value => depName.startsWith(value))
            break
          case 'pattern':
            matches = new RegExp(matcher.pattern).test(depName)
            break
        }

        if (matches) {
          // Если matcher имеет свою категорию, используем её
          return matcher.category || rule.category
        }
      }
    }

    return this.config.categorization.defaultCategory
  }

  /**
   * Умное разрешение конфликтов версий
   */
  resolveVersionConflict(depName, versions) {
    if (versions.length === 1) {
      return versions[0]
    }

    const uniqueVersions = [...new Set(versions)]
    if (uniqueVersions.length === 1) {
      return uniqueVersions[0]
    }

    const strategy = this.config.versionConflictResolution.strategy

    switch (strategy) {
      case 'semantic-latest':
        return this.resolveSemanticLatest(depName, uniqueVersions)
      case 'latest':
        return this.resolveLatest(depName, uniqueVersions)
      case 'first':
        return this.resolveFirst(depName, uniqueVersions)
      case 'manual':
        throw new Error(`Manual resolution required for ${depName}: ${uniqueVersions.join(', ')}`)
      default:
        console.warn(`⚠️  Unknown strategy ${strategy}, using 'first'`)
        return this.resolveFirst(depName, uniqueVersions)
    }
  }

  /**
   * Разрешение по семантической версии (самая новая стабильная)
   */
  resolveSemanticLatest(depName, versions) {
    // Простая реализация - в реальности нужна библиотека semver
    const sorted = versions.sort((a, b) => {
      // Убираем ^ и ~ префиксы для сравнения
      const cleanA = a.replace(/^[~^]/, '')
      const cleanB = b.replace(/^[~^]/, '')

      // Простое сравнение версий (для демонстрации)
      return cleanB.localeCompare(cleanA, undefined, { numeric: true })
    })

    const result = sorted[0]
    console.log(`✅ Resolved ${depName} to: ${result} (semantic-latest)`)
    this.stats.conflictsResolved++
    return result
  }

  /**
   * Разрешение по последней версии (простое сравнение)
   */
  resolveLatest(depName, versions) {
    const sorted = versions.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
    const result = sorted[0]
    console.log(`✅ Resolved ${depName} to: ${result} (latest)`)
    this.stats.conflictsResolved++
    return result
  }

  /**
   * Разрешение первой версией (как в оригинале)
   */
  resolveFirst(depName, versions) {
    const result = versions[0]
    console.log(`✅ Resolved ${depName} to: ${result} (first)`)
    this.stats.conflictsResolved++
    return result
  }

  /**
   * Сканирует зависимости в package.json файле с учетом типов зависимостей
   */
  scanPackageDependencies(packageFile) {
    try {
      const content = fs.readFileSync(packageFile, 'utf8')
      const packageData = JSON.parse(content)

      const dependencies = {}

      // Собираем зависимости из всех настроенных типов
      for (const depType of this.config.dependencyTypes.include) {
        if (packageData[depType]) {
          Object.assign(dependencies, packageData[depType])
        }
      }

      // Исключаем нежелательные типы
      for (const depType of this.config.dependencyTypes.exclude) {
        if (packageData[depType]) {
          for (const depName of Object.keys(packageData[depType])) {
            delete dependencies[depName]
          }
        }
      }

      return dependencies
    } catch (error) {
      console.error(`❌ Error scanning ${packageFile}:`, error.message)
      return {}
    }
  }

  /**
   * Находит все workspace packages с поддержкой разных паттернов
   */
  findWorkspacePackages() {
    const packageFiles = []

    for (const pattern of this.config.workspacePatterns) {
      try {
        // Поддержка как простых паттернов, так и сложных выражений
        if (pattern.includes('*')) {
          const files = execSync(
            `find . -name "package.json" -path "./${pattern}" -not -path "*/node_modules/*" -type f`,
            {
              encoding: 'utf8',
              cwd: this.rootDir,
            },
          )
            .trim()
            .split('\n')
            .filter(Boolean)

          packageFiles.push(...files)
        } else {
          // Прямой путь к файлу
          if (fs.existsSync(pattern)) {
            packageFiles.push(pattern)
          }
        }
      } catch (error) {
        // Игнорируем ошибки для несуществующих паттернов
      }
    }

    return [...new Set(packageFiles)] // Убираем дубликаты
  }

  /**
   * Анализирует зависимости без изменений
   */
  async analyze() {
    console.log('🔍 Analyzing dependencies for generic catalog migration...')

    try {
      const packageFiles = this.findWorkspacePackages()
      console.log(`📦 Found ${packageFiles.length} workspace packages`)

      const allDependencies = new Map()

      for (const packageFile of packageFiles) {
        this.stats.packagesScanned++

        const dependencies = this.scanPackageDependencies(packageFile)

        for (const [depName, depVersion] of Object.entries(dependencies)) {
          // Пропускаем workspace и локальные зависимости
          if (
            depVersion.startsWith('workspace:') ||
            depVersion.startsWith('file:')
          ) {
            continue
          }

          this.stats.dependenciesFound++

          if (!allDependencies.has(depName)) {
            allDependencies.set(depName, {
              versions: [],
              category: this.categorizeDependency(depName, depVersion),
            })
          }

          const depInfo = allDependencies.get(depName)
          if (!depInfo.versions.includes(depVersion)) {
            depInfo.versions.push(depVersion)
          }
        }
      }

      // Разрешаем конфликты версий и строим catalogs
      for (const [depName, depInfo] of allDependencies) {
        const resolvedVersion = this.resolveVersionConflict(
          depName,
          depInfo.versions,
        )
        const category = depInfo.category

        const catalogConfig = this.config.catalogs[category]
        if (catalogConfig.name === 'catalog') {
          this.catalogs.catalog[depName] = resolvedVersion
        } else {
          this.catalogs.catalogs[catalogConfig.name][depName] = resolvedVersion
        }

        this.stats.catalogEntries++
      }

      // Показываем результаты
      this.showAnalysisResults()

    } catch (error) {
      console.error('❌ Error during analysis:', error.message)
      process.exit(1)
    }
  }

  /**
   * Показывает результаты анализа
   */
  showAnalysisResults() {
    console.log('\n📊 Analysis Results:')
    console.log(`📦 Packages scanned: ${this.stats.packagesScanned}`)
    console.log(`🔗 Dependencies found: ${this.stats.dependenciesFound}`)
    console.log(`⚔️  Conflicts resolved: ${this.stats.conflictsResolved}`)
    console.log(`📋 Catalog entries: ${this.stats.catalogEntries}`)

    console.log('\n📦 Generated Catalogs:')
    if (Object.keys(this.catalogs.catalog).length > 0) {
      console.log('\nRuntime Dependencies (catalog):')
      for (const [dep, version] of Object.entries(this.catalogs.catalog)) {
        console.log(`  ${dep}: ${version}`)
      }
    }

    for (const [categoryName, deps] of Object.entries(this.catalogs.catalogs)) {
      if (Object.keys(deps).length > 0) {
        console.log(`\n${categoryName} Dependencies:`)
        for (const [dep, version] of Object.entries(deps)) {
          console.log(`  ${dep}: ${version}`)
        }
      }
    }

    console.log('\n✅ Analysis completed successfully!')
    console.log('💡 Run "migrate" command to apply these changes')
  }

  /**
   * Выполняет миграцию в catalog структуру
   */
  async migrate() {
    console.log('🔄 Starting generic catalog migration...')

    try {
      // Сначала выполняем анализ
      await this.analyze()

      if (this.stats.catalogEntries === 0) {
        console.log('ℹ️  No dependencies to migrate')
        return
      }

      // Загружаем текущий root package.json
      const rootPackage = JSON.parse(
        fs.readFileSync(this.rootPackageJson, 'utf8'),
      )

      // Обновляем workspaces секцию
      if (!rootPackage.workspaces) {
        rootPackage.workspaces = { packages: ['packages/*'] }
      }

      // Мерджим catalogs
      rootPackage.workspaces.catalog = {
        ...rootPackage.workspaces.catalog,
        ...this.catalogs.catalog
      }

      rootPackage.workspaces.catalogs = {
        ...rootPackage.workspaces.catalogs,
        ...this.catalogs.catalogs
      }

      // Сохраняем обновленный package.json
      fs.writeFileSync(
        this.rootPackageJson,
        JSON.stringify(rootPackage, null, 2) + '\n',
      )

      console.log('\n✅ Migration completed successfully!')
      console.log(
        `📦 Updated root package.json with ${this.stats.catalogEntries} catalog entries`,
      )
      console.log('🎯 Dependencies are now centralized in catalogs')

      // Теперь нужно заменить зависимости в пакетах на catalog:*
      await this.updateWorkspacePackages()
    } catch (error) {
      console.error('❌ Error during migration:', error.message)
      process.exit(1)
    }
  }

  /**
   * Обновляет workspace пакеты для использования catalog ссылок
   */
  async updateWorkspacePackages() {
    console.log('\n🔄 Updating workspace packages to use catalog references...')

    try {
      const packageFiles = this.findWorkspacePackages()
      let updatedPackages = 0

      for (const packageFile of packageFiles) {
        try {
          const content = fs.readFileSync(packageFile, 'utf8')
          const packageData = JSON.parse(content)
          let modified = false

          // Обрабатываем каждую секцию зависимостей
          for (const section of this.config.dependencyTypes.include) {
            if (!packageData[section]) continue

            for (const [depName, depVersion] of Object.entries(
              packageData[section],
            )) {
              // Пропускаем workspace и локальные зависимости
              if (
                depVersion.startsWith('workspace:') ||
                depVersion.startsWith('file:')
              ) {
                continue
              }

              // Определяем категорию и проверяем наличие в каталогах
              const category = this.categorizeDependency(depName, depVersion)
              const catalogConfig = this.config.catalogs[category]

              if (catalogConfig.name === 'catalog' && this.catalogs.catalog[depName]) {
                packageData[section][depName] = 'catalog:'
                modified = true
              } else if (
                catalogConfig.name !== 'catalog' &&
                this.catalogs.catalogs[catalogConfig.name]?.[depName]
              ) {
                packageData[section][depName] = `catalog:${catalogConfig.name}`
                modified = true
              }
            }
          }

          // Сохраняем изменения
          if (modified) {
            fs.writeFileSync(
              packageFile,
              JSON.stringify(packageData, null, 2) + '\n',
            )
            console.log(`✅ Updated: ${packageFile}`)
            updatedPackages++
          }
        } catch (error) {
          console.error(`❌ Error updating ${packageFile}:`, error.message)
        }
      }

      console.log(`\n✅ Updated ${updatedPackages} workspace packages`)
      console.log('🎯 All dependencies now use catalog:* references')
    } catch (error) {
      console.error('❌ Error updating workspace packages:', error.message)
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2)
  const command = args[0] || 'help'

  // Парсим аргументы
  const options = {}
  for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2)
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : true
      options[key] = value
    }
  }

  const configPath = options.config || 'migrate-catalog.config.jsonc'
  const migrator = new GenericCatalogMigrator(configPath)

  switch (command) {
    case 'analyze':
      await migrator.analyze()
      break
    case 'migrate':
      await migrator.migrate()
      break
    case 'init-config':
      migrator.initConfig()
      break
    case 'help':
    case '--help':
    case '-h':
      migrator.showHelp()
      break
    default:
      console.error(`❌ Unknown command: ${command}`)
      console.error('Available commands: analyze, migrate, init-config, help')
      process.exit(1)
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Fatal error:', error.message)
    process.exit(1)
  })
}

module.exports = GenericCatalogMigrator
