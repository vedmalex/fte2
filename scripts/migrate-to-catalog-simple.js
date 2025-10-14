#!/usr/bin/env node

/**
 * Simple Catalog Migration Script v3.0
 *
 * Упрощенная миграция зависимостей в централизованную Bun catalog структуру.
 *
 * Принцип: тип зависимости определяет категорию
 * - dependencies → runtime (catalog)
 * - devDependencies → development
 * - peerDependencies → runtime (catalog)
 *
 * Особенности:
 * - Автоматическая категоризация по типу зависимости
 * - Минимальная конфигурация
 * - Умное разрешение конфликтов версий
 */

const fs = require('node:fs')
const path = require('node:path')
const { execSync } = require('node:child_process')
const { parse } = require('jsonc-parser')

class SimpleCatalogMigrator {
  constructor(configPath = null) {
    this.rootDir = process.cwd()
    this.rootPackageJson = path.join(this.rootDir, 'package.json')

    // Загружаем конфигурацию
    this.config = this.loadConfig(configPath)

    // Инициализируем структуру catalogs
    this.catalogs = {
      catalog: {},
      catalogs: {
        development: {},
      },
    }

    this.stats = {
      packagesScanned: 0,
      dependenciesFound: 0,
      conflictsResolved: 0,
      catalogEntries: 0,
    }
  }

  /**
   * Загружает конфигурацию с поддержкой JSONC (JSON with Comments)
   */
  loadConfig(configPath) {
    const defaultConfig = {
      workspacePatterns: ['packages/*/package.json', 'apps/*/package.json'],
      // Категории по типу зависимости
      dependencyTypeMapping: {
        dependencies: 'catalog',      // runtime
        devDependencies: 'development',
        peerDependencies: 'catalog', // runtime
      },
      // Исключения - специфические пакеты в других категориях
      overrides: {
        // Примеры переопределений
        // 'typescript': 'build',
        // 'eslint': 'development',
      },
      versionConflictResolution: {
        strategy: 'semantic-latest',
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
   * Показывает справку
   */
  showHelp() {
    console.log(`
🔧 Simple Catalog Migration Script v3.0 - Migrate to Bun Catalogs

Usage: node scripts/migrate-to-catalog-simple.js <command> [options]

Commands:
  analyze          Analyze dependencies without making changes
  migrate          Perform migration to catalog structure
  init-config      Generate default configuration file
  help            Show this help message

Options:
  --config <file>  Path to configuration file (default: migrate-catalog-simple.config.jsonc)

Examples:
  # Quick analyze
  node scripts/migrate-to-catalog-simple.js analyze

  # Quick migrate
  node scripts/migrate-to-catalog-simple.js migrate

  # Generate config for customization
  node scripts/migrate-to-catalog-simple.js init-config

Migration Logic:
  • dependencies → runtime (catalog)
  • devDependencies → development
  • peerDependencies → runtime (catalog)

  Exceptions can be defined in config overrides.
`)
  }

  /**
   * Генерирует файл конфигурации по умолчанию
   */
  initConfig() {
    const configPath = 'migrate-catalog-simple.config.jsonc'

    if (fs.existsSync(configPath)) {
      console.log(`⚠️  Config file already exists: ${configPath}`)
      console.log('Edit this file to customize migration rules')
      return
    }

    fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2) + '\n')
    console.log(`✅ Generated default config: ${configPath}`)
    console.log('Edit this file to add overrides or customize behavior')
  }

  /**
   * Определяет категорию зависимости по её типу и overrides
   */
  categorizeDependency(depName, depType) {
    // Сначала проверяем overrides
    if (this.config.overrides[depName]) {
      return this.config.overrides[depName]
    }

    // Затем используем mapping по типу зависимости
    const category = this.config.dependencyTypeMapping[depType]
    return category || 'catalog' // fallback
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
      default:
        console.warn(`⚠️  Unknown strategy ${strategy}, using 'first'`)
        return this.resolveFirst(depName, uniqueVersions)
    }
  }

  /**
   * Разрешение по семантической версии
   */
  resolveSemanticLatest(depName, versions) {
    const sorted = versions.sort((a, b) => {
      const cleanA = a.replace(/^[~^]/, '')
      const cleanB = b.replace(/^[~^]/, '')
      return cleanB.localeCompare(cleanA, undefined, { numeric: true })
    })

    const result = sorted[0]
    console.log(`✅ Resolved ${depName} to: ${result} (semantic-latest)`)
    this.stats.conflictsResolved++
    return result
  }

  /**
   * Разрешение по последней версии
   */
  resolveLatest(depName, versions) {
    const sorted = versions.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
    const result = sorted[0]
    console.log(`✅ Resolved ${depName} to: ${result} (latest)`)
    this.stats.conflictsResolved++
    return result
  }

  /**
   * Разрешение первой версией
   */
  resolveFirst(depName, versions) {
    const result = versions[0]
    console.log(`✅ Resolved ${depName} to: ${result} (first)`)
    this.stats.conflictsResolved++
    return result
  }

  /**
   * Сканирует зависимости в package.json файле с учетом типов
   */
  scanPackageDependencies(packageFile) {
    try {
      const content = fs.readFileSync(packageFile, 'utf8')
      const packageData = JSON.parse(content)

      const dependencies = {}

      // Собираем зависимости из настроенных типов
      for (const depType of this.config.dependencyTypes.include) {
        if (packageData[depType]) {
          // Сохраняем тип зависимости для каждой
          for (const [depName, depVersion] of Object.entries(packageData[depType])) {
            dependencies[depName] = {
              version: depVersion,
              type: depType
            }
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
   * Находит workspace packages
   */
  findWorkspacePackages() {
    const packageFiles = []

    for (const pattern of this.config.workspacePatterns) {
      try {
        const files = execSync(
          `find . -name "package.json" -path "./${pattern}" -type f`,
          {
            encoding: 'utf8',
            cwd: this.rootDir,
          },
        )
          .trim()
          .split('\n')
          .filter(Boolean)

        packageFiles.push(...files)
      } catch (error) {
        // Игнорируем ошибки для несуществующих паттернов
      }
    }

    return [...new Set(packageFiles)]
  }

  /**
   * Анализирует зависимости без изменений
   */
  async analyze() {
    console.log('🔍 Analyzing dependencies for simple catalog migration...')

    try {
      const packageFiles = this.findWorkspacePackages()
      console.log(`📦 Found ${packageFiles.length} workspace packages`)

      const allDependencies = new Map()

      for (const packageFile of packageFiles) {
        this.stats.packagesScanned++

        const dependencies = this.scanPackageDependencies(packageFile)

        for (const [depName, depInfo] of Object.entries(dependencies)) {
          // Пропускаем workspace и локальные зависимости
          if (
            depInfo.version.startsWith('workspace:') ||
            depInfo.version.startsWith('file:')
          ) {
            continue
          }

          this.stats.dependenciesFound++

          if (!allDependencies.has(depName)) {
            allDependencies.set(depName, {
              versions: [],
              type: depInfo.type,
              category: this.categorizeDependency(depName, depInfo.type),
            })
          }

          const depData = allDependencies.get(depName)
          if (!depData.versions.includes(depInfo.version)) {
            depData.versions.push(depInfo.version)
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

        if (category === 'catalog') {
          this.catalogs.catalog[depName] = resolvedVersion
        } else {
          this.catalogs.catalogs[category][depName] = resolvedVersion
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
   * Выполняет миграцию
   */
  async migrate() {
    console.log('🔄 Starting simple catalog migration...')

    try {
      // Сначала выполняем анализ
      await this.analyze()

      if (this.stats.catalogEntries === 0) {
        console.log('ℹ️  No dependencies to migrate')
        return
      }

      // Загружаем root package.json
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

      // Сохраняем
      fs.writeFileSync(
        this.rootPackageJson,
        JSON.stringify(rootPackage, null, 2) + '\n',
      )

      console.log('\n✅ Migration completed successfully!')
      console.log(
        `📦 Updated root package.json with ${this.stats.catalogEntries} catalog entries`,
      )
      console.log('🎯 Dependencies are now centralized in catalogs')

      // Обновляем workspace пакеты
      await this.updateWorkspacePackages()
    } catch (error) {
      console.error('❌ Error during migration:', error.message)
      process.exit(1)
    }
  }

  /**
   * Обновляет workspace пакеты
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

          // Обрабатываем секции зависимостей
          for (const section of this.config.dependencyTypes.include) {
            if (!packageData[section]) continue

            for (const [depName, depVersion] of Object.entries(
              packageData[section],
            )) {
              // Пропускаем workspace и локальные
              if (
                depVersion.startsWith('workspace:') ||
                depVersion.startsWith('file:')
              ) {
                continue
              }

              const category = this.categorizeDependency(depName, section)

              if (category === 'catalog' && this.catalogs.catalog[depName]) {
                packageData[section][depName] = 'catalog:'
                modified = true
              } else if (
                category !== 'catalog' &&
                this.catalogs.catalogs[category]?.[depName]
              ) {
                packageData[section][depName] = `catalog:${category}`
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

  const configPath = options.config || 'migrate-catalog-simple.config.jsonc'
  const migrator = new SimpleCatalogMigrator(configPath)

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

module.exports = SimpleCatalogMigrator
